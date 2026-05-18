import { Box, IconButton } from "@mui/material";

import {
    Edit,
    Delete,
    Visibility
} from "@mui/icons-material";

const ActionButtons = ({
    item,
    onView,
    onEdit,
    onDelete
}) => (

    <Box
        sx={{
            display: "flex",
            gap: 1
        }}
    >

        <IconButton
            size="small"
            color="primary"
            title="Visualizar"
            onClick={() => onView(item)}
            sx={{
                width: 40,
                height: 40,

                "&:hover": {
                    backgroundColor: "primary.light",
                    color: "white"
                }
            }}
        >
            <Visibility fontSize="small" />
        </IconButton>

        <IconButton
            size="small"
            color="secondary"
            title="Editar"
            onClick={() => onEdit(item)}
            sx={{
                width: 40,
                height: 40,

                "&:hover": {
                    backgroundColor: "secondary.light",
                    color: "white"
                }
            }}
        >
            <Edit fontSize="small" />
        </IconButton>

        <IconButton
            size="small"
            color="error"
            title="Excluir"
            onClick={() => onDelete(item)}
            sx={{
                width: 40,
                height: 40,

                "&:hover": {
                    backgroundColor: "error.light",
                    color: "white"
                }
            }}
        >
            <Delete fontSize="small" />
        </IconButton>

    </Box>
);

export default ActionButtons;