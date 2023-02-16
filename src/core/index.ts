import {DefaultOptions, TrackerConfig, Options, reportTrackerData} from '../types/index'
import {createHistoryEvent} from '../utils/pv'

const MouseEventList: string[] = ['click', 'dblclick', 'contextmenu', 'mousedown', 'mouseup', 'mouseenter', 'mouseout', 'mouseover']

export default class Tracker {
    public data: Options
    public version: string | undefined

    public constructor(options: Options) {
        this.data = Object.assign(this.initDef(), options)
        this.installTracker()
    }

    public setUserId<T extends DefaultOptions['uuid']>(uuid: T) {
        this.data.uuid = uuid
    }

    public setExtra<T extends DefaultOptions['extra']>(extra: T) {
        this.data.extra = extra
    }

    public sendTracker<T extends reportTrackerData>(data: T) {
        this.reportTracker(data)
    }

    private initDef() : DefaultOptions {
        this.version = TrackerConfig.version
        window.history['pushState'] = createHistoryEvent('pushState')
        window.history['replaceState'] = createHistoryEvent('replaceState')
        return <DefaultOptions> {
            sdkVersion: this.version,
            historyTracker: false,
            hashTracker: false,
            domTracker: false,
            jsError: false,
        }
    }

    private targetKeyReport() {
        MouseEventList.forEach(event => {
            window.addEventListener(event, (e) => {
                const target = e.target as HTMLElement
                const targetValue = target.getAttribute('target-key')
                if (targetValue) {
                    this.sendTracker({
                        targetKey: targetValue,
                        event
                    })
                }
            })
        })
    }

    private captureEvents<T>(mouseEventList:string[], targetKey:string, data?:T) {
        mouseEventList.forEach(event => {
            window.addEventListener(event, () => {
                this.reportTracker({
                    event,
                    targetKey,
                    data
                })
            })
        })
    }

    private installTracker() {
        if (this.data.historyTracker) {
            this.captureEvents(['pushState', 'replaceState'], 'history-pv')
        }
        if (this.data.hashTracker) {
            this.captureEvents(['hashchange'], 'hash-pv')
        }
        if (this.data.domTracker) {
            this.targetKeyReport()
        }
        if (this.data.jsError) {
            this.jsError()
        }
    }

    private jsError() {
        this.errorEvent()
        this.promiseReject()
    }

    private errorEvent() {
        window.addEventListener('error', (e) => {
            this.sendTracker({
                targetKey: 'message',
                event: 'error',
                message: e.message
            })
        })
    }

    private promiseReject() {
        window.addEventListener('unhandledrejection', (event) => {
            event.promise.catch(error => {
                this.sendTracker({
                    targetKey: 'reject',
                    event: "promise",
                    message: error
                })
            })
        })
    }

    private reportTracker<T>(data: T) {
        const params = Object.assign(this.data, data, {time: new Date().getTime()})
        let headers = {
            type: 'application/x-www-form-urlencoded'
        }
        let blob = new Blob([JSON.stringify(params)], headers)
        navigator.sendBeacon(this.data.requestUrl, blob)
    }
}
