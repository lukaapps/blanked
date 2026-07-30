export type DemoProfileType = "chef" | "landlord" | "customer";

export type DemoProfileOverride = {
  name: string;
  photo: string | null;
  email?: string;
  businessName?: string;
  bio?: string;
  role?: string;
  instagram?: string;
  website?: string;
  addressLine?: string;
  addressSuburb?: string;
  addressState?: string;
  addressPostcode?: string;
  spaceTypePreferences?: string[];
  photos?: string[];
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

// Demo mode has no Storage backend, so uploaded photos are kept as
// data URLs in localStorage instead of real uploaded files.
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
