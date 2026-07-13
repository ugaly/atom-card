const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

export function getWeb3FormsAccessKey() {
  return (import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined)?.trim() || "";
}

export type Web3FormPayload = {
  subject: string;
  name?: string;
  email?: string;
  phone?: string;
  message: string;
  from_name?: string;
  [key: string]: string | undefined;
};

export async function submitToWeb3Forms(payload: Web3FormPayload) {
  const accessKey = getWeb3FormsAccessKey();
  if (!accessKey) {
    throw new Error(
      "Web3Forms is not configured. Add VITE_WEB3FORMS_ACCESS_KEY to your .env file.",
    );
  }

  const response = await fetch(WEB3FORMS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      access_key: accessKey,
      botcheck: false,
      ...payload,
    }),
  });

  const data = (await response.json()) as { success?: boolean; message?: string };

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to submit form. Please try again.");
  }

  return data;
}
