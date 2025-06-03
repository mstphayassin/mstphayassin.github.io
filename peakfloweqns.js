var fr95_q = {
    "name": "Froehlich (1995)",
    "func": null,
    "description": "Placeholder description for Fr95_Q.",
    "mean": 0.2558,
    "stdev": 0.4828
}

fr95_q.func = function(dam) {
    return 0.607 * (dam.V_w**0.295) * (dam.H_w**1.24)
}

var we96_q = {
    "name": "Webby (1996)",
    "func": null,
    "description": "Placeholder description for We96_Q.",
    "mean": 0.1738,
    "stdev": 0.4483
}

we96_q.func = (dam) => {
    return 0.0443 * 9.81**0.5 * dam.V_w**0.365 * dam.H_w**1.40
}

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
    return 0.0175 * kM * kH * (9.81 * dam.V_w * dam.H_w * dam.H_b**2 / dam.W)**0.5;
}

var zh20_q = {
    "name": "Zhang et al. (2020)",
    "func": null,
    "description": "Placeholder description for Zh20_Q.",
    "mean": 0.0927,
    "stdev": 0.4504
}

zh20_q.func = function(dam){
    // homogenous
    c0 = -1.58
    c1 = -0.76
    c2 = 0.10
    c3 = -4.55
    if (dam.type == 'core-wall') {
        c0 = -1.51
        c1 = -1.09 
        c2 = -0.12
        c3 = -3.61
    }
    V_w = dam.V_w
    H_w = dam.H_w
    H_d = dam.H_d
    H_b = dam.H_b
    return 9.81**0.5 * V_w * H_w**-0.5 * (V_w**(1./3.) / H_w)**c0 * (H_w / H_b)**c1 * H_d**c2 * Math.exp(c3)
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
eqn_map.set("Fr95", fr95_q);
eqn_map.set("We96", we96_q);
eqn_map.set("Xu09", xu09_q);
eqn_map.set("Ho14", ho14_q);
eqn_map.set("Az15", az15_q);
eqn_map.set("Fr16", fr16_q);
eqn_map.set("Zh20", zh20_q);
eqn_map.set("Ya25", ya25_q);
