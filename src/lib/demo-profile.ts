export type DemoProfileType = "chef" | "landlord" | "customer";

export type DemoProfileOverride = {
  name: string;
  photo: string | null;
};

function demoProfileKey(type: DemoProfileType) {
  return `blanked_demo_profile_${type}`;
}

export function readDemoProfileOverride(
  type: DemoProfileType
): DemoProfileOverride | null {
  const raw = window.localStorage.getItem(demoProfileKey(type));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DemoProfileOverride;
  } catch {
    return null;
  }
}

export function writeDemoProfileOverride(
  type: DemoProfileType,
  override: DemoProfileOverride
) {
  window.localStorage.setItem(demoProfileKey(type), JSON.stringify(override));
}
