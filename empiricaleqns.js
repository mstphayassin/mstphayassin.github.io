var fr95_q = {
    "name": "Froehlich (1995)",
    "func": null,
    "func_re": null,
    "description": `An early equation that introduced multi-linear regression to this problem, outperforming earlier methods which used only simple linear regression. Prone to overestimating the peak flow.`,
    "mean": 0.2558,
    "stdev": 0.4828,
    "mean_re": -0.0831,
    "stdev_re": 0.4380
}

fr95_q.func = function(dam) {
    return 0.607 * (dam.V_w**0.295) * (dam.H_w**1.24)
}

fr95_q.func_re = function(dam) {
    return 0.040 * dam.V_w**0.46 * dam.H_w**1.11
}

var we96_q = {
    "name": "Webby (1996)",
    "func": null,
    "func_re": null,
    "description": `A simple, dimensionally homogenous equation that uses only height and volume of water, calibrated using simple linear regression. The form of this equation became the basis for subsequent models.`,
    "mean": 0.1738,
    "stdev": 0.4483,
    "mean_re": -0.0132,
    "stdev_re": 0.4380
}

we96_q.func = (dam) => {
    return 0.0443 * 9.81**0.5 * dam.V_w**0.365 * dam.H_w**1.40
}

we96_q.func_re = (dam) => {
    return 0.015 * 9.81**0.5 * dam.V_w**0.46 * dam.H_w**1.11
}

var xu09_q = {
    "name": "Xu and Zhang (2009)",
    "func": null,
    "func_re": null,
    "description": `A dimensionally homogenous equation that includes discrete variables as well as continuous variables, allowing the model to account for the effect of dam erodibility and failure mode of the dam. This is one of the only equations that includes an indication of the erodibility of the dam, which is a key factor in accurately predicting the peak flow.`,
    "mean": 0.2136,
    "stdev": 0.4268,
    "mean_re": -0.0070,
    "stdev_re": 0.3633
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

xu09_q.func_re = (dam) => {
    kM = 1;
    if (dam.mode === 'overtopping') {
        kM = .92;
    }
    kE = 1;
    if (dam.erodibility === "low") {
        kE = 1.0;
    } else if (dam.erodibility === "high") {
        kE = 3.8;
    }
    return 0.012 * kM * kE * 9.81**0.5 * dam.H_w**1.11 * dam.V_w**0.46
}

var ho14_q = {
    "name": "Hooshyaripor et al. (2014)",
    "func": null,
    "func_re": null,
    "description": `A simple, dimensionally homogenous equation that uses only height and volume of water. This equation uses a 3-dimensional Gaussian copula to generate synthetic data to assist in the calibration of the model, but Yassin et al. (2025) found that the effect of the copula on the model performance is negligible.`,
    "mean": -0.0551,
    "stdev": 0.4381,
    "mean_re": -0.0155,
    "stdev_re": 0.4382
}

ho14_q.func = function(dam){
    return 0.0454 * dam.H_w**1.156 * dam.V_w**0.448
}

ho14_q.func_re = (dam) => {
    return 0.016 * 9.81**0.5 * dam.V_w**0.45 * dam.H_w**1.14;
}

var az15_q = {
    "name": "Azimi et al. (2015)",
    "func": null,
    "func_re": null,
    "description": `A simple, dimensionally homogenous equation that uses only height and volume of water. This equation was developed using a large dataset of dam failures and used cross-validation to ensure that the model performance is robust. Yassin et al. (2025) found that this is one of the most accurate models available, but it can still produce large errors.`,
    "mean": 0.1602,
    "stdev": 0.4393,
    "mean_re": -0.0132,
    "stdev_re": 0.4380
}

az15_q.func = function(dam) {
    // Azimi et al. (2015) equation for peak flow
    return 16.553 * (9.81 * dam.V_w/1000000.)**0.5 * dam.H_w
}

az15_q.func_re = (dam) => {
    return 0.015 * 9.81**0.5 * dam.V_w**0.46 * dam.H_w**1.11;
}

var fr16_q = {
    "name": "Froehlich (2016)",
    "func": null,
    "func_re": null,
    "description": `A more complicated equation that accounts for the mode of failure, as well as the depth of the breach and the average embankment width. This equation also includes a height factor that adjusts the peak flow for dams larger than 6.1 m, making this the only equation to treat smaller and larger dams differently. Despite this, Yassin et al. (2025) found that none of these innovations significantly improved the model performance compared to simpler models.`,
    "mean": 0.2234,
    "stdev": 0.4517,
    "mean_re": 0.0318,
    "stdev_re": 0.4274
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

fr16_q.func_re = (dam) => {
    kM = 1. // piping
    if (dam.mode === "overtopping") {
        kM = 1.01;
    }
    kH = 1.; //  height factor
    if (dam.H_w >= 4.6) { // THIS IS SUPPOSED TO BE H_b
        kH = (dam.H_w / 4.6)**0.20;
    }
    return 0.012 * 9.81**0.5 * kM * kH * dam.H_w**0.31 * dam.V_w**0.46 * dam.H_b**0.76 * dam.W**0.067;
}

var zh20_q = {
    "name": "Zhong et al. (2020)",
    "func": null,
    "func_re": null,
    "description": `This equation separates homogenous-fill and core-wall dams in its calibration, which allows it to account for the different properties of these two types of dams. However, this does not significantly improve the model performance compared to simpler models (Yassin et al., 2025).`,
    "mean": 0.0927,
    "stdev": 0.4504,
    "mean_re": 0.0318,
    "stdev_re": 0.4274
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

zh20_q.func_re = function(dam){
    // homogenous
    c = 0.018
    c0 = 0.40
    c1 = 0.44
    c2 = 0.78
    c3 = -0.04
    if (dam.type == 'core-wall') {
        c = 0.019
        c0 = -0.16
        c1 = 0.40
        c2 = 1.45
        c3 = 0.08
    }
    return c * 9.81**0.5 * dam.H_w**c0 * dam.V_w**c1 * dam.H_b**c2 * dam.H_d**c3
}

var ya25_q = {
    "name": "Yassin et al. (2025)",
    "func": null,
    "func_re": null,
    "description": `This equation is a simple equation that uses height and volume of water, but also includes a "high erodibility" adjustment factor. It is the most robust and accurate of the models, but it is still prone to large errors in some cases.`,
    "mean": -0.0174,
    "stdev": 0.3635,
    "mean_re": -0.0174,
    "stdev_re": 0.3635
}

ya25_q.func = function(dam) {
    kE = 1.0; // Erodibility factor, can be adjusted based on erodibility
    if (dam.erodibility === "high") {
        kE = 3.8;
    }
    return 0.011 * kE * (9.81**0.5) * (dam.H_w**1.11) * (dam.V_w**0.46);
}

ya25_q.func_re = ya25_q.func // recalibration is not available for this equation

const q_eqn_map = new Map();
q_eqn_map.set("Fr95", fr95_q);
q_eqn_map.set("We96", we96_q);
q_eqn_map.set("Xu09", xu09_q);
q_eqn_map.set("Ho14", ho14_q);
q_eqn_map.set("Az15", az15_q);
q_eqn_map.set("Fr16", fr16_q);
q_eqn_map.set("Zh20", zh20_q);
q_eqn_map.set("Ya25", ya25_q);

// T eqns

var fr95_t = {
    name: "Froehlich (1995)",
    func: null,
    func_re: null,
    description: `Placeholder for Froehlich (1995) equation for time to failure.`,
    "mean": -0.0997,
    "stdev": 0.3562,
    "mean_re": -0.0079,
    "stdev_re": 0.3235
}

fr95_t.func = (dam) => {
    return 3.84 * (dam.V_w/10**6)**0.53 * dam.H_b**-0.90;
}

fr95_t.func_re = (dam) => {
    return 0.026 * dam.V_w**0.37 * dam.H_b**-0.78;
}

var fr08_t = {
    name: "Froehlich (2008)",
    func: null,
    func_re: null,
    description: `Placeholder for Froehlich (2008) equation for time to failure.`,
    "mean": -0.0684,
    "stdev": 0.3410,
    "mean_re": -0.0185,
    "stdev_re": 0.3273
}

fr08_t.func = (dam) => {
    return 63.2 * (dam.V_w / 9.81 / dam.H_b**2)**0.5 / 3600;
}

fr08_t.func_re = (dam) => {
    return 0.045 * 9.81**-0.5 * dam.V_w**0.39 * dam.H_b**-0.68;
}

var xu09_t = {
    name: "Xu and Zhang (2009)",
    func: null,
    func_re: null,
    description: `Placeholder for Xu and Zhang (2009) equation for time to failure.`,
    "mean": 0.1456,
    "stdev": 0.3495,
    "mean_re": 0.0192,
    "stdev_re": 0.3194,
}

xu09_t.func = (dam) => {
    // Xu and Zhang (2009) equation for time to failure
    var kE = 1.0; // Erodibility factor
    if (dam.erodibility === "high") {
        kE = 0.58;
    } else if (dam.erodibility === "low") {
        kE = 3.11;
    }
    return 0.01122 * kE * dam.H_d**0.654 * dam.V_w**0.415 * dam.H_w**-1.246;
}

xu09_t.func_re = (dam) => {
    var kE = 1.0; // Erodibility factor
    if (dam.erodibility === "high") {
        kE = 0.78;
    } else if (dam.erodibility === "low") {
        kE = 3.3;
    }
    return 0.043 * kE * dam.H_d**0.35 * dam.V_w**0.29 * dam.H_w**-0.86
}

zh20_t = {
    name: "Zhong et al. (2020)",
    func: null,
    func_re: null,
    description: `Placeholder for Zhong et al. (2020) equation for time to failure.`,
    "mean": 0.1088,
    "stdev": 1.8251,
    "mean_re": 0.0232,
    "stdev_re": 0.3075
}

zh20_t.func = (dam) => {
    // homogenous
    c0 = 0.56
    c1 = -0.85
    c2 = -0.32
    c3 = Math.exp(-0.2)
    if (dam.type == 'core-wall') {
        c0 = 1.52
        c1 = -11.36 
        c2 = -0.43
        c3 = Math.exp(-1.57)
    }
    return (dam.V_w**(1/3) / dam.H_w)**c0 * (dam.H_w / dam.H_b)**c1 * dam.H_d**c2 * c3
}

zh20_t.func_re = (dam) => {
    // homogenous
    c0 = 0.025
    c1 = 0.36
    c2 = -0.22
    c3 = 0.40
    c4 = 0.40
    if (dam.type == 'core-wall') {
        c0 = .0086
        c1 = .45 
        c2 = -0.11
        c3 = -1.24
        c4 = 0.47
    }
   return c0 * dam.V_w**c1 * dam.H_w**c2 * dam.H_b**c3 * dam.H_d**c4
}

const t_eqn_map = new Map();
t_eqn_map.set("Fr95", fr95_t);
t_eqn_map.set("Fr08", fr08_t);
t_eqn_map.set("Xu09", xu09_t);
t_eqn_map.set("Zh20", zh20_t);
