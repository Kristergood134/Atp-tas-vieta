const LKS92WGS84 = (() => {
    // Koordinātu pārvērojumos izmantotās konstantes
    const PI = Math.PI;
    const A_AXIS = 6378137; // Elipses modeļa lielā ass (a)
    const B_AXIS = 6356752.31414; // Elipses modeļa mazā ass (b)
    const CENTRAL_MERIDIAN = PI * 24 / 180; // Centrālais meridiāns
    const OFFSET_X = 500000; // Koordinātu nobīde horizontālās (x) ass virzienā
    const OFFSET_Y = -6000000; // Koordinātu nobīde vertikālās (y) ass virzienā
    const SCALE = 0.9996; // Kartes mērogojuma faktors

    // Aprēķina loka garumu no ekvatora līdz dotā punkta ģeogrāfiskajam platumam
    const getArcLengthOfMeridian = (phi) => {
        const n = (A_AXIS - B_AXIS) / (A_AXIS + B_AXIS);
        const alpha = ((A_AXIS + B_AXIS) / 2) * (1 + (Math.pow(n, 2) / 4) + (Math.pow(n, 4) / 64));
        const beta = (-3 * n / 2) + (9 * Math.pow(n, 3) / 16) - (3 * Math.pow(n, 5) / 32);
        const gamma = (15 * Math.pow(n, 2) / 16) - (15 * Math.pow(n, 4) / 32);
        const delta = (-35 * Math.pow(n, 3) / 48) + (105 * Math.pow(n, 5) / 256);
        const epsilon = (315 * Math.pow(n, 4) / 512);

        return alpha * (phi + beta * Math.sin(2 * phi) + gamma * Math.sin(4 * phi) + delta * Math.sin(6 * phi) + epsilon * Math.sin(8 * phi));
    };

    // Aprēķina ģeogrāfisko platumu centrālā meridiāna punktam
    const getFootpointLatitude = (y) => {
        const n = (A_AXIS - B_AXIS) / (A_AXIS + B_AXIS);
        const alpha = ((A_AXIS + B_AXIS) / 2) * (1 + (Math.pow(n, 2) / 4) + (Math.pow(n, 4) / 64));
        const yd = y / alpha;
        const beta = (3 * n / 2) - (27 * Math.pow(n, 3) / 32) + (269 * Math.pow(n, 5) / 512);
        const gamma = (21 * Math.pow(n, 2) / 16) - (55 * Math.pow(n, 4) / 32);
        const delta = (151 * Math.pow(n, 3) / 96) - (417 * Math.pow(n, 5) / 128);
        const epsilon = (1097 * Math.pow(n, 4) / 512);

        return yd + beta * Math.sin(2 * yd) + gamma * Math.sin(4 * yd) + delta * Math.sin(6 * yd) + epsilon * Math.sin(8 * yd);
    };

    // Funkcijas pārveidošanai
    const convertMapLatLngToXY = (phi, lambda, lambda0) => {
        const ep2 = (Math.pow(A_AXIS, 2) - Math.pow(B_AXIS, 2)) / Math.pow(B_AXIS, 2);
        const nu2 = ep2 * Math.pow(Math.cos(phi), 2);
        const N = Math.pow(A_AXIS, 2) / (B_AXIS * Math.sqrt(1 + nu2));
        const t = Math.tan(phi);
        const t2 = t * t;
        const l = lambda - lambda0;

        const x = N * Math.cos(phi) * l +
            (N / 6) * Math.pow(Math.cos(phi), 3) * (1 - t2 + nu2) * Math.pow(l, 3) +
            (N / 120) * Math.pow(Math.cos(phi), 5) * (5 - 18 * t2 + t2 * t2 + 14 * nu2 - 58 * t2 * nu2) * Math.pow(l, 5);

        const y = getArcLengthOfMeridian(phi) +
            (t / 2) * N * Math.pow(Math.cos(phi), 2) * Math.pow(l, 2) +
            (t / 24) * N * Math.pow(Math.cos(phi), 4) * (5 - t2 + 9 * nu2 + 4 * nu2 * nu2) * Math.pow(l, 4);

        return [x, y];
    };

    return {
        getArcLengthOfMeridian,
        getFootpointLatitude,
        convertMapLatLngToXY
    };
})();

