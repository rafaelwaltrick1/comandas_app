import { useCallback } from "react";

export const useDialog = () => {
    const showConfirm = useCallback((title, message, onConfirm) => {
        const confirmed = window.confirm(`${title}\n\n${message}`);

        if (confirmed && typeof onConfirm === "function") {
            onConfirm();
        }
    }, []);

    return { showConfirm };
};

export default useDialog;