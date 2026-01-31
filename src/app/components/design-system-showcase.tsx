import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { StatusBadge } from '@/app/components/status-badge';
import { Separator } from '@/app/components/ui/separator';

export function DesignSystemShowcase() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">SACCO Design System</h1>
        <p className="text-muted-foreground">
          A comprehensive design system for banking and SACCO management applications
        </p>
      </div>

      {/* Color Palette */}
      <Card>
        <CardHeader>
          <CardTitle>Color Palette</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-3">Primary Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-[#2563EB] flex items-center justify-center text-white font-semibold">
                  Primary
                </div>
                <p className="text-sm text-muted-foreground">#2563EB</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-[#10B981] flex items-center justify-center text-white font-semibold">
                  Secondary
                </div>
                <p className="text-sm text-muted-foreground">#10B981</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-[#F59E0B] flex items-center justify-center text-white font-semibold">
                  Accent
                </div>
                <p className="text-sm text-muted-foreground">#F59E0B</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-[#059669] flex items-center justify-center text-white font-semibold">
                  Success
                </div>
                <p className="text-sm text-muted-foreground">#059669</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-3">Status Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-[#DC2626] flex items-center justify-center text-white font-semibold">
                  Danger
                </div>
                <p className="text-sm text-muted-foreground">#DC2626</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-[#EA580C] flex items-center justify-center text-white font-semibold">
                  Warning
                </div>
                <p className="text-sm text-muted-foreground">#EA580C</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-[#8B5CF6] flex items-center justify-center text-white font-semibold">
                  Disbursed
                </div>
                <p className="text-sm text-muted-foreground">#8B5CF6</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-[#0891b2] flex items-center justify-center text-white font-semibold">
                  Completed
                </div>
                <p className="text-sm text-muted-foreground">#0891b2</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle>Typography</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Font Family: Inter</p>
            <h1 className="mb-2">Heading 1 - The quick brown fox</h1>
            <h2 className="mb-2">Heading 2 - The quick brown fox</h2>
            <h3 className="mb-2">Heading 3 - The quick brown fox</h3>
            <h4 className="mb-2">Heading 4 - The quick brown fox</h4>
            <p>Body Text - The quick brown fox jumps over the lazy dog</p>
            <p className="text-sm">Small Text - The quick brown fox jumps over the lazy dog</p>
            <code className="font-mono">Code Text - ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789</code>
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button>Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="destructive">Danger Button</Button>
            <Button disabled>Disabled Button</Button>
          </div>
        </CardContent>
      </Card>

      {/* Status Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Status Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <StatusBadge status="active" />
            <StatusBadge status="pending" />
            <StatusBadge status="approved" />
            <StatusBadge status="defaulted" />
            <StatusBadge status="completed" />
            <StatusBadge status="inactive" />
            <StatusBadge status="draft" />
            <StatusBadge status="disbursed" />
            <StatusBadge status="probation" />
          </div>
        </CardContent>
      </Card>

      {/* Spacing */}
      <Card>
        <CardHeader>
          <CardTitle>Spacing (8px Grid System)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <div className="w-1 h-1 bg-primary"></div>
              <span className="text-sm">4px</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-primary"></div>
              <span className="text-sm">8px</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-primary"></div>
              <span className="text-sm">12px</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 bg-primary"></div>
              <span className="text-sm">16px</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 bg-primary"></div>
              <span className="text-sm">24px</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-primary"></div>
              <span className="text-sm">32px</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Border Radius */}
      <Card>
        <CardHeader>
          <CardTitle>Border Radius</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-20 bg-primary/10 rounded-sm flex items-center justify-center">
                <span className="text-sm font-medium">sm (4px)</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-primary/10 rounded-md flex items-center justify-center">
                <span className="text-sm font-medium">md (8px)</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-sm font-medium">lg (12px)</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-primary/10 rounded-xl flex items-center justify-center">
                <span className="text-sm font-medium">xl (16px)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
