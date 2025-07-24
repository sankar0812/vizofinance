export function getClientId(c) {
  return c?._id ?? c?.id;
}