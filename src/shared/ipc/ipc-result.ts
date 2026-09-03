export type IpcSuccess<T> = { ok: true; data: T };
export type IpcFailure = { ok: false; error?: unknown; reason?: string; message?: string };
export type IpcResult<T> = IpcSuccess<T> | IpcFailure;
