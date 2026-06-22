const urlBase = process.env.NEXT_PUBLIC_URL_BASE;

async function getBundlesService(): Promise<any[] | undefined> {
  try {
    const res = await fetch(`${urlBase}/bundle`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) return;

    const { bundles } = await res.json();
    return bundles;
  } catch {
    return;
  }
}

async function getBundlePorIdService(id: string): Promise<any | undefined> {
  try {
    const res = await fetch(`${urlBase}/bundle/${id}`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) return;

    return await res.json();
  } catch {
    return;
  }
}

async function adicionarBundleService(dados: any): Promise<[number, string] | undefined> {
  try {
    const res = await fetch(`${urlBase}/bundle`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    const json = await res.json();
    return [res.status, json.id];
  } catch {
    return;
  }
}

async function atualizarBundleService(dados: any): Promise<number | undefined> {
  try {
    const res = await fetch(`${urlBase}/bundle`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    return res.status;
  } catch {
    return;
  }
}

async function excluirBundleService(id: string): Promise<number | undefined> {
  try {
    const res = await fetch(`${urlBase}/bundle/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    return res.status;
  } catch {
    return;
  }
}

export {
  getBundlesService,
  getBundlePorIdService,
  adicionarBundleService,
  atualizarBundleService,
  excluirBundleService,
};
