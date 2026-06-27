import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from "@mui/material";

const DuplicateValidator = ({
    open,
    title,
    message,
    onClose,
    onView,
    onEdit
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle>
                {title}
            </DialogTitle>

            <DialogContent>
                <DialogContentText>
                    {message}
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={onClose}
                    color="inherit"
                >
                    Cancelar
                </Button>

                <Button
                    onClick={onView}
                    color="info"
                    variant="outlined"
                >
                    Visualizar
                </Button>

                <Button
                    onClick={onEdit}
                    color="warning"
                    variant="contained"
                >
                    Editar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DuplicateValidator;