import { useEffect, useState } from "react";
import { getSettings, updateSettings } from "../api/api";

const Settings = () => {
  const [settings, setSettings] = useState({
    heartRateLow: "",
    heartRateHigh: "",
    spo2Low: "",
    tempHigh: "",
    bpSystolicHigh: "",
    bpDiastolicHigh: ""
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getSettings();
        setSettings({
          heartRateLow: res?.heartRateLow ?? "",
          heartRateHigh: res?.heartRateHigh ?? "",
          spo2Low: res?.spo2Low ?? "",
          tempHigh: res?.tempHigh ?? "",
          bpSystolicHigh: res?.bpSystolicHigh ?? "",
          bpDiastolicHigh: res?.bpDiastolicHigh ?? ""
        });
      } catch (err) {
        console.error("Error loading settings:", err);
      }
    };
    load();
  }, []);

  const handleUpdate = async () => {
    try {
      const updated = await updateSettings(settings);
      alert("Settings updated successfully");
      setSettings(updated);
    } catch (err) {
      alert("Update failed");
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 dark:focus:border-blue-500 outline-none dark:text-white transition-all";

  return (
    <div className="space-y-8">

      <div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Alert Threshold Settings</h2>
        <p className="text-slate-600 dark:text-slate-400">Configure safe ranges for automated monitoring</p>
      </div>

      <div className="bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 rounded-2xl p-8 space-y-8">

        {/* Group: Heart Rate */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Heart Rate</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-slate-600 dark:text-slate-400 font-medium">Minimum</label>
              <input
                type="number"
                value={settings.heartRateLow}
                onChange={(e) =>
                  setSettings({ ...settings, heartRateLow: e.target.value })
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm text-slate-600 dark:text-slate-400 font-medium">Maximum</label>
              <input
                type="number"
                value={settings.heartRateHigh}
                onChange={(e) =>
                  setSettings({ ...settings, heartRateHigh: e.target.value })
                }
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Group: Oxygen & Temperature */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Oxygen & Temperature</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-slate-600 dark:text-slate-400 font-medium">Min SpO₂ (%)</label>
              <input
                type="number"
                value={settings.spo2Low}
                onChange={(e) =>
                  setSettings({ ...settings, spo2Low: e.target.value })
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm text-slate-600 dark:text-slate-400 font-medium">Max Temperature (°C)</label>
              <input
                type="number"
                value={settings.tempHigh}
                onChange={(e) =>
                  setSettings({ ...settings, tempHigh: e.target.value })
                }
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Group: Blood Pressure */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Blood Pressure</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                Systolic High
              </label>
              <input
                type="number"
                value={settings.bpSystolicHigh}
                onChange={(e) =>
                  setSettings({ ...settings, bpSystolicHigh: e.target.value })
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                Diastolic High
              </label>
              <input
                type="number"
                value={settings.bpDiastolicHigh}
                onChange={(e) =>
                  setSettings({ ...settings, bpDiastolicHigh: e.target.value })
                }
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleUpdate}
            className="px-7 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg text-lg">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
