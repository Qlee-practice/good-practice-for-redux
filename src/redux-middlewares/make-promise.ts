export const makePromise = () => (next: (action: any) => void) => (action: any) => {
  const payload = action.payload || null;
  return Promise.resolve(payload).then(resolved => next({ ...action, payload: resolved }));
};