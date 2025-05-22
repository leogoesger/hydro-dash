import { defaultGauges, RiverInfo } from "../gauges";

export const GetGaugeMappedByName = () => {
    const gaugeMap = new Map<string, RiverInfo>();
    defaultGauges.map((gauge) => {
        gaugeMap.set(gauge.name, gauge);
    }
    )
    return gaugeMap;
}
