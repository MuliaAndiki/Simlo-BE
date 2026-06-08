import { uploadBase64Image } from "@/utils/clodinary";

export async function uploadAnnotatedMlImage(
  base64: string,
  reportId: string,
): Promise<string> {
  const result = await uploadBase64Image(
    base64,
    "simlo/ml-annotated",
    `report-${reportId}-${Date.now()}`,
  );

  return result.secure_url;
}
