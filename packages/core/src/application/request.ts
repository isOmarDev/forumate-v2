export type Request<
  TBody = unknown,
  TQuery = Record<string, unknown>,
  TParams = Record<string, unknown>,
> = {
  body: TBody;
  query: TQuery;
  params: TParams;
};
