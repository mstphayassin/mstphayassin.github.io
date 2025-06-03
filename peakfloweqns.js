var xu09_q = {
    "name": "Xu and Zhang (2009)",
    "func": null,
    "description": "Placeholder description for Xu09_Q.",
    "mean": 0.2136,
    "stdev": 0.4268,
}

xu09_q.func = function(dam) {
    // Xu and Zhang (2009) equation for peak flow
    var kE = 1.0; // Erodibility factor, can be adjusted based on erodibility
    if (dam.erodibility === "high") {
        kE = 1.51;
    } else if (dam.erodibility === "low") {
        kE = 0.39;
    }
    var kM = 1.0; // Mode factor, can be adjusted based on mode of failure
    if (dam.mode === "overtopping") {
        kM = 1.56;
    }
    return kE * kM * 0.024 * (9.81**0.5) * (dam.H_w**1.28) * (dam.V_w**0.41);
}

var ho14_q = {
    "name": "Hooshyaripor et al. (2014)",
    "func": null,
    "description": "Placeholder description for Ho14_Q.",
    "mean": -0.0551,
    "stdev": 0.4281,
}

ho14_q.func = function(dam){
    return 0.0454 * dam.H_w**1.156 * dam.V_w**0.448
}

var az15_q = {
    "name": "Azimi et al. (2015)",
    "func": null,
    "description": "Placeholder description for Az15_Q.",
    "mean": 0.1602,
    "stdev": 0.4393
}

az15_q.func = function(dam) {
    // Azimi et al. (2015) equation for peak flow
    return 16.553 * (9.81 * dam.V_w/1000000.)**0.5 * dam.H_w
}

var fr16_q = {
    "name": "Froehlich (2016)",
    "func": null,
    "description": "Placeholder description for Fr16_Q.",
    "mean": 0.2234,
    "stdev": 0.4517
}

fr16_q.func = function(dam){
    kM = 1.; // mode factor
    if (dam.mode === "overtopping") {
        kM = 1.85;
    }
    kH = 1.; //  height factor
    if (dam.H_w >= 6.1) { // THIS IS SUPPOSED TO BE H_b
        kH = (dam.H_w / 6.1)**(1 / 8.0);
    }
    w = dam.H_w * 2.6; // THIS SHOULD BE AN INPUT
    return 0.0175 * kM * kH * (9.81 * dam.V_w * dam.H_w * dam.H_w**2 / w)**0.5;
    // supposed to be: 0.0175 kM kH (9.81 V_w H_w H_b^2 / W)^0.5
}

var zh20_q = {
    "name": "Zhang et al. (2020)",
    "func": null,
    "description": "Placeholder description for Zh20_Q.",
    "mean": 0.0, // Placeholder mean
    "stdev": 0.0 // Placeholder standard deviation
}

var ya25_q = {
    "name": "Yassin et al. (2025)",
    "func": null,
    "description": "Placeholder description for Ya25_Q.",
    "mean": -0.0174,
    "stdev": 0.3635
}

ya25_q.func = function(dam) {
    kE = 1.0; // Erodibility factor, can be adjusted based on erodibility
    if (dam.erodibility === "high") {
        kE = 3.8;
    }
    return 0.011 * kE * (9.81**0.5) * (dam.H_w**1.11) * (dam.V_w**0.46);
}

// set up equation map of non-recalibrated equations
// TODO: Implement the other equations
const eqn_map = new Map();
eqn_map.set("Xu09", xu09_q);
eqn_map.set("Ho14", ho14_q); // Placeholder for Hooshyaripor et al. (2014)
eqn_map.set("Az15", az15_q); // Placeholder for Azimi et al. (2015)
eqn_map.set("Fr16", fr16_q); // Placeholder for Froehlich (2016)
eqn_map.set("Zh20", null); // Placeholder for Zhang et al. (2020)
eqn_map.set("Ya25", ya25_q); // Placeholder for Yassin et al. (2025)
