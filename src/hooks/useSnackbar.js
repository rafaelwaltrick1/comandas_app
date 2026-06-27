import { useCallback } from "react";

export const useSnackbar = () => {
    const showSnackbar = useCallback((message, severity = "info") => {
        if (severity === "success") {
            alert(`✅ ${message}`);
            return;
        }

        if (severity === "error") {
            alert(`❌ ${message}`);
            return;
        }

        if (severity === "warning") {
            alert(`⚠️ ${message}`);
            return;
        }

        alert(message);
    }, []);

    return { showSnackbar };
};

export default useSnackbar;