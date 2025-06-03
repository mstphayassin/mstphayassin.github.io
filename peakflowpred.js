function get_peak_flow(dam) {
    var eqn = document.getElementById("q-eqn-select").value;
    if (eqn_map.has(eqn)) {
        var func = eqn_map.get(eqn).func;
        if (func) {
            return func(dam);
        } else {
            console.warn("Equation function not implemented for: " + eqn);
            return 0; // Return 0 or some default value if the equation is not implemented
        }
    } else {
        console.error("Unknown equation: " + eqn);
        return 0; // Return 0 or some default value if the equation is unknown
    }
}

// Determine input values and calculate the peak flow
function update_pred_result() {
    var h = document.getElementById("H-w").value;
    var v = document.getElementById("V-w").value;
    var q = get_peak_flow({
        H_w: parseFloat(h),
        V_w: parseFloat(v),
        erodibility: document.getElementById("erodibility").value,
        mode: document.getElementById("failure_mode").value
    });
    document.getElementById("q-pred-result").innerText = q.toFixed(0);

    // Get the upper bound based on the selected equation's performance
    var eqn = document.getElementById("q-eqn-select").value;
    if (eqn_map.has(eqn)) {
        var mean = eqn_map.get(eqn).mean;
        var stdev = eqn_map.get(eqn).stdev;
        var upper_bound = q * 10**(mean + 1.645 * stdev); // one-sided 95% confidence interval
        document.getElementById("q-upper-result").innerText = upper_bound.toFixed(0);
    } else {
        document.getElementById("q-upper-result").innerText = "N/A";
    }
}

// When the equation selection changes, update the description
function update_eqn_desc() {
    var eqn = document.getElementById("q-eqn-select").value;
    if (eqn_map.has(eqn)) {
        var desc = eqn_map.get(eqn).description;
        document.getElementById("q-eqn-desc").innerText = desc;
    } else {
        document.getElementById("q-eqn-desc").innerText = "No description available.";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Set the initial value of the prediction result
    update_pred_result();
    update_eqn_desc();
    // Add event listeners to input fields
    document.getElementById("H-w").addEventListener('input', update_pred_result);
    document.getElementById("V-w").addEventListener('input', update_pred_result);
    document.getElementById("erodibility").addEventListener('input', update_pred_result);
    document.getElementById("failure_mode").addEventListener('input', update_pred_result);
    document.getElementById("q-eqn-select").addEventListener('input', update_pred_result);
    document.getElementById("q-eqn-select").addEventListener('input', update_eqn_desc);
});