const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

/** Public Web3Forms access key (safe to use client-side). */
export const WEB3FORMS_ACCESS_KEY = "26c92a7d-6fee-41c6-9ba5-ff21d1233ab1";

export type Web3FormPayload = {
  name: string;
  email: string;
  message: string;
  subject?: string;
};

export async function submitToWeb3Forms({ name, email, message, subject }: Web3FormPayload) {
  const response = await fetch(WEB3FORMS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      access_key: WEB3FORMS_ACCESS_KEY,
      name,
      email,
      message,
      subject: subject || "New submission from AtomCard",
      from_name: "AtomCard website",
      botcheck: false,
    }),
  });

  const data = (await response.json()) as { success?: boolean; message?: string };

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to submit form. Please try again.");
  }

  return data;
}
