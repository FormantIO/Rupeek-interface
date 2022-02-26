import { QueueStore } from "./QueueStore";
import { QueueService } from "./services/queue.service";
import { createContext } from "react";

interface IStoreContext {
  queueStore: QueueStore;
}

const queueService = new QueueService();
const queueStore = new QueueStore(queueService);

export const StoreContext = createContext<IStoreContext>({
  queueStore,
});
