import {MessageBroker} from "../../broker/MessageBroker";

export interface IReadDataManagerOptions {
    groupId: string;
    messageBroker: MessageBroker;
    topic: string;
}
