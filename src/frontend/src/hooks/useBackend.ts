import { useActor } from "@caffeineai/core-infrastructure";
import { createActor } from "../backend";
import type { backendInterface } from "../backend";

/**
 * Returns a typed backend actor and loading state.
 * Use actor.methodName() for direct calls.
 */
export function useBackend() {
  const { actor: rawActor, isFetching } = useActor(createActor);
  const actor = rawActor as backendInterface | null;
  return { actor, isFetching };
}
