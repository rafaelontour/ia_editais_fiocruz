async function getBundlesService(_unitId?: string): Promise<any[] | undefined> {
  // mock: atualmente não há bundles persistidos; retorna array vazio para não quebrar a UI
  return [];
}

export { getBundlesService };
