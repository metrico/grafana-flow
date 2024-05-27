// @ts-ignore
import appEvents from 'grafana/app/core/app_events';
import { AppEvents } from '@grafana/data';
export const useNotification = () => {

    const success = (message: string) => {
        appEvents.emit(AppEvents.alertSuccess, [message])
    }

    const error = (message: string) => {
        appEvents.emit(AppEvents.alertError, [message])
    }

    const warning = (message: string) => {
        appEvents.emit(AppEvents.alertWarning, [message])
    }
    return {
        success,
        error,
        warning
    }
}
