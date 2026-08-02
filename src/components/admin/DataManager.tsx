import { useState, useEffect, useRef, useCallback } from 'react';
import { collection, getDocs, doc, writeBatch } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule, ClientSideRowModelModule, themeQuartz } from 'ag-grid-community';
import type { ColDef } from 'ag-grid-community';
import { Download, Upload, Save, Plus, RefreshCw } from 'lucide-react';

ModuleRegistry.registerModules([AllCommunityModule, ClientSideRowModelModule]);

const COLLECTIONS = [
  { id: 'players', name: 'Players' },
  { id: 'teams', name: 'Teams' },
  { id: 'competitions', name: 'Competitions' },
  { id: 'games', name: 'Games' },
  { id: 'statistics', name: 'Statistics' },
  { id: 'settings', name: 'Settings' }
];

export default function DataManager() {
  const [selectedCollection, setSelectedCollection] = useState(COLLECTIONS[0].id);
  const [rowData, setRowData] = useState<any[]>([]);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const gridRef = useRef<AgGridReact>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, selectedCollection));
      const data: any[] = [];
      const allKeys = new Set<string>();

      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        const row: any = { id: doc.id }; // Ensure id is mapped

        // Convert objects/arrays to JSON strings for display
        Object.entries(docData).forEach(([key, value]) => {
          allKeys.add(key);
          if (value && typeof value === 'object') {
            row[key] = JSON.stringify(value);
          } else {
            row[key] = value;
          }
        });
        data.push(row);
      });

      // Always include id column first
      const cols: ColDef[] = [{ field: 'id', headerName: 'ID', editable: false, pinned: 'left', width: 150 }];

      Array.from(allKeys).forEach(key => {
        if (key !== 'id') {
           cols.push({
             field: key,
             editable: true,
             sortable: true,
             filter: true,
             resizable: true,
             minWidth: 150
           });
        }
      });

      setColumnDefs(cols);
      setRowData(data);
    } catch (err) {
      console.error("Error loading data:", err);
      alert("Failed to load data.");
    } finally {
      setLoading(false);
    }
  }, [selectedCollection]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSave = async () => {
    if (!gridRef.current) return;

    setSaving(true);
    try {
      const batch = writeBatch(db);
      const rows: any[] = [];

      gridRef.current.api.forEachNode((node) => {
        if (node.data) rows.push(node.data);
      });

      for (const row of rows) {
        if (!row.id) continue;

        const docRef = doc(db, selectedCollection, row.id);
        const dataToSave = { ...row };
        delete dataToSave.id;

        // Try to parse JSON strings back to objects
        Object.keys(dataToSave).forEach(key => {
          if (typeof dataToSave[key] === 'string' && (dataToSave[key].startsWith('{') || dataToSave[key].startsWith('['))) {
             try {
                dataToSave[key] = JSON.parse(dataToSave[key]);
             } catch {
                // Not valid JSON, keep as string
             }
          }
        });

        batch.set(docRef, dataToSave, { merge: true }); // Using set with merge to create or update
      }

      await batch.commit();
      alert("Changes saved successfully!");
      loadData();
    } catch (err) {
      console.error("Error saving data:", err);
      alert("Failed to save data.");
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    if (!gridRef.current) return;
    const rows: any[] = [];
    gridRef.current.api.forEachNode((node) => {
      if (node.data) rows.push(node.data);
    });

    // Convert JSON strings back to objects for clean export
    const exportData = rows.map(row => {
      const cleanRow = {...row};
      Object.keys(cleanRow).forEach(key => {
         if (typeof cleanRow[key] === 'string' && (cleanRow[key].startsWith('{') || cleanRow[key].startsWith('['))) {
             try {
                cleanRow[key] = JSON.parse(cleanRow[key]);
             } catch {}
         }
      });
      return cleanRow;
    });

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `${selectedCollection}_export_${new Date().toISOString().slice(0,10)}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!Array.isArray(json)) throw new Error("Imported JSON must be an array of objects.");

        // Convert objects to JSON strings for display in grid
        const processedData = json.map(item => {
           const row = {...item};
           // Generate random ID if missing
           if (!row.id) row.id = 'NEW_' + Math.random().toString(36).substr(2, 9);

           Object.keys(row).forEach(key => {
             if (row[key] !== null && typeof row[key] === 'object') {
               row[key] = JSON.stringify(row[key]);
             }
           });
           return row;
        });

        // Add new columns if needed
        const newCols = [...columnDefs];
        let colsChanged = false;

        processedData.forEach(row => {
          Object.keys(row).forEach(key => {
             if (!newCols.find(c => c.field === key)) {
                newCols.push({
                   field: key,
                   editable: true,
                   sortable: true,
                   filter: true,
                   resizable: true,
                   minWidth: 150
                });
                colsChanged = true;
             }
          });
        });

        if (colsChanged) setColumnDefs(newCols);
        setRowData(processedData);

        if (fileInputRef.current) fileInputRef.current.value = '';

      } catch (err) {
        console.error("Import error:", err);
        alert("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
  };

  const handleAddRow = () => {
    const newRow = { id: 'NEW_' + Math.random().toString(36).substr(2, 9) };
    setRowData(prev => [newRow, ...prev]);
  };

  return (
    <div className="p-8 h-[calc(100vh-140px)] flex flex-col">
      <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col h-full shadow-sm">

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-900">Data Manager</h2>
            <select
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className="border border-gray-300 rounded-md py-1.5 px-3 text-sm focus:ring-blue-500 focus:border-blue-500 font-medium"
            >
              {COLLECTIONS.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {loading && <span className="text-sm text-gray-500 animate-pulse flex items-center gap-2"><RefreshCw className="w-4 h-4 animate-spin"/> Loading...</span>}
          </div>

          <div className="flex items-center gap-2">
             <input
                type="file"
                accept=".json"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImport}
             />
             <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                title="Import JSON"
             >
                <Upload className="w-4 h-4" /> Import
             </button>
             <button
                onClick={handleExport}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                title="Export JSON"
             >
                <Download className="w-4 h-4" /> Export
             </button>
             <div className="w-px h-6 bg-gray-300 mx-2"></div>
             <button
                onClick={handleAddRow}
                className="px-3 py-1.5 text-sm bg-blue-50 border border-blue-200 text-blue-700 rounded hover:bg-blue-100 flex items-center gap-2"
             >
                <Plus className="w-4 h-4" /> Row
             </button>
             <button
                onClick={handleSave}
                disabled={saving || loading}
                className="px-4 py-1.5 text-sm bg-gray-900 text-white rounded hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2 ml-2 shadow-sm"
             >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save All'}
             </button>
          </div>
        </div>

        <div className="flex-1 w-full border border-gray-200 rounded-lg overflow-hidden">
          <AgGridReact
            ref={gridRef}
            theme={themeQuartz}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={{
              flex: 1,
              minWidth: 100,
              resizable: true,
            }}
            rowSelection="multiple"
            suppressRowClickSelection={true}
            enableCellTextSelection={true}
            ensureDomOrder={true}
            stopEditingWhenCellsLoseFocus={true}
          />
        </div>

        <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
           Double-click a cell to edit. Nested objects (like arrays) are shown as JSON strings. Ensure valid JSON when editing. "ID" is required but immutable for existing docs.
        </p>

      </div>
    </div>
  );
}
