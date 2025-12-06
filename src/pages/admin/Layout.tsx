import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TableBlock } from '@/components/TableBlock';
import { api } from '@/services/api';
import { toast } from 'sonner';
import type { Table } from '@/types';
import Icon from '@/components/ui/Icon';

export const LayoutEditor = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadTables = async () => {
      try {
        const data = await api.tables.getAll();
        setTables(data);
      } catch (error) {
        console.error('Failed to load tables:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTables();
  }, []);

  const handleSaveLayout = async () => {
    setSaving(true);
    try {
      await api.tables.updateLayout(tables);
      toast.success('Table layout saved successfully');
    } catch (error) {
      toast.error('Failed to save layout');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Table Layout Editor</h1>
          <p className="text-muted-foreground">Arrange and configure your venue tables</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="border-neon-primary/30 hover:bg-neon-primary/10">
            <Icon name="plus" size={16} className="mr-2" />
            Add Table
          </Button>
          <Button
            onClick={handleSaveLayout}
            className="bg-neon-success hover:bg-neon-success/80"
            disabled={saving}
          >
            <Icon name="save" size={16} className="mr-2" />
            {saving ? 'Saving...' : 'Save Layout'}
          </Button>
        </div>
      </div>

      <Card className="glass-card p-6">
        <div className="grid grid-cols-4 gap-4">
          {tables.map((table) => (
            <TableBlock key={table.id} table={table} />
          ))}
        </div>
      </Card>

      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold text-white mb-3">Instructions</h3>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>Click and drag tables to reposition them</li>
          <li>Right-click a table to edit capacity, category, and shape</li>
          <li>Use the Add Table button to create new tables</li>
          <li>Save your changes before leaving the page</li>
        </ul>
      </div>
    </div>
  );
};
