import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

export default function AdmissionsManager() {
  const [enableSubjects, setEnableSubjects] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);

  const loadSettings = useCallback(async () => {
    const { data } = await supabase.from('site_settings').select('key, value').eq('key', 'admissions_subject_selection').maybeSingle();
    if (data) setEnableSubjects(data.value === 'true');
  }, []);

  const loadApplications = useCallback(async () => {
    const { data } = await supabase.from('admission_applications').select('*').order('created_at', { ascending: false });
    setApplications(data || []);
  }, []);

  useEffect(() => { loadSettings(); loadApplications(); }, [loadSettings, loadApplications]);

  const saveSetting = async (key: string, value: string) => {
    const { data: existing } = await supabase.from('site_settings').select('id').eq('key', key).maybeSingle();
    if (existing) {
      await supabase.from('site_settings').update({ value, updated_at: new Date().toISOString() }).eq('key', key);
    } else {
      await supabase.from('site_settings').insert([{ key, value }]);
    }
  };

  const toggleSubjects = async (val: boolean) => {
    setEnableSubjects(val);
    await saveSetting('admissions_subject_selection', String(val));
    toast.success(val ? 'Subject selection enabled on Admissions page' : 'Subject selection disabled');
  };

  const removeApplication = async (id: string) => {
    await supabase.from('admission_applications').delete().eq('id', id);
    toast.success('Application removed');
    loadApplications();
  };

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-foreground mb-6">Admissions Management</h2>

      {/* Toggle */}
      <div className="bg-card border rounded-lg p-5 mb-6 space-y-4">
        <h3 className="font-semibold text-sm text-foreground">Display Controls</h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-foreground">Enable Subject Selection on Admissions Page</div>
            <div className="text-xs text-muted-foreground">Students can select O-Level/A-Level subjects during application</div>
          </div>
          <Switch checked={enableSubjects} onCheckedChange={toggleSubjects} />
        </div>
      </div>

      {/* Applications list */}
      <div className="bg-card border rounded-lg p-5">
        <h3 className="font-semibold text-sm text-foreground mb-4">Recent Applications ({applications.length})</h3>
        {applications.length === 0 ? (
          <p className="text-sm text-muted-foreground">No applications received yet.</p>
        ) : (
          <div className="space-y-3">
            {applications.map(app => (
              <div key={app.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-sm text-foreground">{app.student_name}</div>
                    <div className="text-xs text-muted-foreground">
                      {app.email} {app.phone && `• ${app.phone}`} • {app.level.toUpperCase()} • {new Date(app.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <button onClick={() => removeApplication(app.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {((app.o_level_subjects?.length > 0) || (app.a_level_subjects?.length > 0)) && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-foreground mb-1">Selected Subjects:</p>
                    <div className="flex flex-wrap gap-1">
                      {(app.level === 'o-level' ? app.o_level_subjects : app.a_level_subjects)?.map((s: string) => (
                        <span key={s} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
