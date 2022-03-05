import { response } from "../types/interventions";

export const getLatestUpdate = (_: response[]) => {
  if (_.length === 0) return;
  let latestUpdate = _[0];

  _.forEach((_) =>
    dateToMilliseconds(_.updatedAt) > dateToMilliseconds(latestUpdate.updatedAt)
      ? (latestUpdate = _)
      : undefined
  );

  return latestUpdate;
};

const dateToMilliseconds = (_: string) => {
  return new Date(_).getTime();
};
