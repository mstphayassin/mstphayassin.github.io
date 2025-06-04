function get_peak_flow(dam) {
    var eqn = document.getElementById("q-eqn-select").value;
    if (q_eqn_map.has(eqn)) {
        var func = q_eqn_map.get(eqn).func;
        if (dam.re) {
            // use recalibrated equation if selected
            func = q_eqn_map.get(eqn).func_re;
        }
        if (func) {
            return func(dam);
        } else {
            console.warn("Equation function not implemented for: " + eqn);
            return 0; // Return 0 if the equation is not implemented
        }
    } else {
        console.error("Unknown equation: " + eqn);
        return 0; // Return 0 if the equation is unknown
    }
}

function get_time_to_failure(dam) {
    var eqn = document.getElementById("t-eqn-select").value;
    if (t_eqn_map.has(eqn)) {
        var func = t_eqn_map.get(eqn).func;
        if (dam.re) {
            // use recalibrated equation if selected
            func = t_eqn_map.get(eqn).func_re;
        }
        if (func) {
            return func(dam);
        } else {
            console.warn("Equation function not implemented for: " + eqn);
            return 0; // Return 0 if the equation is not implemented
        }
    } else {
        console.error("Unknown equation: " + eqn);
        return 0; // Return 0 if the equation is unknown
    }
}

// Determine input values and calculate the peak flow/time to failure
function update_pred_result() {
    var h = document.getElementById("H-w").value;
    var v = document.getElementById("V-w").value;
    var hd = document.getElementById("H-d").value;
    var hb = document.getElementById("H-b").value;
    var w = document.getElementById("width").value;
    var use_recal = document.getElementById('use-recal').checked;
    if (!hd){
        hd = h
    }
    if (!hb){
        hb = h
    }
    if (!w){
        w = h * 2.6 // assumption based on average 2.6:1 side slopes
    }
    inputted_dam = {
        re: use_recal,
        H_w: parseFloat(h),
        V_w: parseFloat(v),
        H_b: parseFloat(hb),
        H_d: parseFloat(hd),
        W: parseFloat(w),
        erodibility: document.getElementById("erodibility").value,
        mode: document.getElementById("failure-mode").value,
        type: document.getElementById("dam-type").value,
    };
    var q = get_peak_flow(inputted_dam);
    if (q){
        document.getElementById("q-pred-result").innerText = q.toFixed(0);
        document.getElementById("warning-msg").innerText = "";
    } else {
        document.getElementById("q-pred-result").innerText = "-";
        document.getElementById("warning-msg").innerHTML = "Warning: Peak flow prediction is not available. Ensure H<sub>w</sub> and V<sub>w</sub> have valid values.";
    }

    // Get the upper bound based on the selected equation's performance
    var q_eqn = document.getElementById("q-eqn-select").value;
    if (q_eqn_map.has(q_eqn)) {
        var mean;
        var stdev;
        if (use_recal){
            mean = q_eqn_map.get(q_eqn).mean_re;
            stdev = q_eqn_map.get(q_eqn).stdev_re;
        } else {
            mean = q_eqn_map.get(q_eqn).mean;
            stdev = q_eqn_map.get(q_eqn).stdev;
        }
        // Note: the mean is negative because these means are pred/obs and we want obs/pred
        var upper_bound = q * 10**(-1.*mean + 1.645 * stdev); // one-sided 95% confidence interval
        if (upper_bound){
            document.getElementById("q-upper-result").innerText = upper_bound.toFixed(0);
        } else {
            document.getElementById("q-upper-result").innerText = "-";
        }
    } else {
        document.getElementById("q-upper-result").innerText = "-";
    }
    // Update the time to failure prediction
    var tf = get_time_to_failure(inputted_dam);
    var hours = Math.floor(tf);
    var minutes = Math.floor((tf - hours) * 60);
    var seconds = Math.floor(((tf - hours) * 60 - minutes) * 60);
    if (tf){
        document.getElementById("t-pred-result").innerText = hours + "h " + minutes + "m " + seconds + "s";
        document.getElementById("warning-msg").innerText = "";
    } else {
        document.getElementById("t-pred-result").innerText = "-";
        document.getElementById("warning-msg").innerHTML = "Warning: Time to failure prediction is not available. Ensure H<sub>w</sub> and V<sub>w</sub> have valid values.";
    }
    // Get the upper bound based on the selected equation's performance
    var t_eqn = document.getElementById("t-eqn-select").value;
    if (t_eqn_map.has(t_eqn)) {
        var mean;
        var stdev;
        if (use_recal){
            mean = t_eqn_map.get(t_eqn).mean_re;
            stdev = t_eqn_map.get(t_eqn).stdev_re;
        } else {
            mean = t_eqn_map.get(t_eqn).mean;
            stdev = t_eqn_map.get(t_eqn).stdev;
        }
        // Note: the mean is negative because these means are pred/obs and we want obs/pred
        var lower_bound = tf * 10**(-1.*mean - 1.645 * stdev); // one-sided 95% confidence interval
        hours = Math.floor(lower_bound);
        minutes = Math.floor((lower_bound - hours) * 60);
        seconds = Math.floor(((lower_bound - hours) * 60 - minutes) * 60);
        if (lower_bound){
            document.getElementById("t-lower-result").innerText = hours + "h " + minutes + "m " + seconds + "s";
        } else {
            document.getElementById("t-lower-result").innerText = "-";
        }
    } else {
        document.getElementById("t-lower-result").innerText = "-";
    }
}

// When the equation selection changes, update the description
function update_eqn_desc() {
    var q_eqn = document.getElementById("q-eqn-select").value;
    if (q_eqn_map.has(q_eqn)) {
        var desc = q_eqn_map.get(q_eqn).description;
        document.getElementById("q-eqn-desc").innerText = desc;
    } else {
        document.getElementById("q-eqn-desc").innerText = "No description available.";
    }
    var t_eqn = document.getElementById("t-eqn-select").value;
    if (t_eqn_map.has(t_eqn)) {
        var desc = t_eqn_map.get(t_eqn).description;
        document.getElementById("t-eqn-desc").innerText = desc;
    } else {
        document.getElementById("t-eqn-desc").innerText = "No description available.";
    }
}

function draw_chart() {
    new Chartist.Line('#q-chart', {
        labels: ['1', '2', '3', '4'],
        series: [[1, 10, 100, 1000]]
    }, {width: 400,
        height: 300,
        axisY:{scale:'log'},
        axisX:{scale: 'log'},
        plugins: [
            Chartist.plugins.ctAxisTitle({
                axisX: {
                    axisTitle: 'X title',
                    axisClass: 'ct-axis-title',
                    offset: {
                        x: 0,
                        y: 30,
                    },
                    textAnchor: 'middle'
                },
                axisY: {
                    axisTitle: 'Y title',
                    axisClass: 'ct-axis-title',
                    offset: {
                        x: 0,
                        y: 0
                    },
                    textAnchor: 'middle',
                    flipTitle: false
                    }
                })
        ]})
}

document.addEventListener("DOMContentLoaded", function () {
    // Set the initial value of the prediction result
    // draw_chart();
    update_pred_result();
    update_eqn_desc();
    // Add event listeners to input fields
    document.getElementById("H-w").addEventListener('input', update_pred_result);
    document.getElementById("V-w").addEventListener('input', update_pred_result);
    document.getElementById("H-b").addEventListener('input', update_pred_result);
    document.getElementById("H-d").addEventListener('input', update_pred_result);
    document.getElementById("width").addEventListener('input', update_pred_result);
    document.getElementById("erodibility").addEventListener('input', update_pred_result);
    document.getElementById("failure-mode").addEventListener('input', update_pred_result);
    document.getElementById("dam-type").addEventListener('input', update_pred_result);
    document.getElementById("use-recal").addEventListener('input', update_pred_result);
    document.getElementById("q-eqn-select").addEventListener('input', update_pred_result);
    document.getElementById("t-eqn-select").addEventListener('input', update_pred_result);

    // Update equation description as well
    document.getElementById("q-eqn-select").addEventListener('input', update_eqn_desc);
    document.getElementById("t-eqn-select").addEventListener('input', update_eqn_desc);
});