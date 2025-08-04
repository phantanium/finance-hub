import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export default function Settings() {
  const [settings, setSettings] = useState({
    showBenchmarks: true,
    autoRefresh: false,
    notifications: true,
    darkMode: false,
    showTargets: true,
    exportFormat: 'pdf'
  });

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Configure your dashboard preferences and display options
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Display Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="benchmarks">Show Industry Benchmarks</Label>
                <p className="text-sm text-muted-foreground">
                  Display industry averages in charts and comparisons
                </p>
              </div>
              <Switch
                id="benchmarks"
                checked={settings.showBenchmarks}
                onCheckedChange={(checked) => handleSettingChange('showBenchmarks', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="targets">Show Target Lines</Label>
                <p className="text-sm text-muted-foreground">
                  Display target values in metric cards
                </p>
              </div>
              <Switch
                id="targets"
                checked={settings.showTargets}
                onCheckedChange={(checked) => handleSettingChange('showTargets', checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Data & Refresh</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-refresh">Auto Refresh Data</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically update financial data every 15 minutes
                </p>
              </div>
              <Switch
                id="auto-refresh"
                checked={settings.autoRefresh}
                onCheckedChange={(checked) => handleSettingChange('autoRefresh', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Enable Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about significant ratio changes
                </p>
              </div>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Export Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Default Export Format</h4>
              <p className="text-sm text-muted-foreground">
                Choose the default format for exporting reports
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">PDF</Button>
              <Button variant="outline" size="sm">Excel</Button>
              <Button variant="outline" size="sm">PNG</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}