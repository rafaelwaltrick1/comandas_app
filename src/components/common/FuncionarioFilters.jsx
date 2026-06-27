import { useState, useEffect } from 'react';

import {
    TextField,
    Box,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';

import { Clear, FilterList } from '@mui/icons-material';

const FuncionarioFilters = ({
    onFilter,
    onClear,
    filters: externalFilters = {},
}) => {
    const [filters, setFilters] = useState({
        id: '',
        nome: '',
        cpf: '',
        telefone: '',
        grupo: '',
    });

    useEffect(() => {
        setFilters((prev) => ({
            ...prev,
            ...externalFilters,
        }));
    }, [externalFilters]);

    const handleInputChange = (field) => (event) => {
        const value = event.target.value;

        setFilters((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleFilter = () => {
        const cleanedFilters = Object.keys(filters).reduce((acc, key) => {
            const value = filters[key];

            if (value !== '' && value !== null && value !== undefined) {
                acc[key] = key === 'id' || key === 'grupo'
                    ? Number(value)
                    : value;
            }

            return acc;
        }, {});

        onFilter(cleanedFilters);
    };

    const handleClear = () => {
        setFilters({
            id: '',
            nome: '',
            cpf: '',
            telefone: '',
            grupo: '',
        });

        onClear();
    };

    const hasActiveFilters = Object.values(filters).some(
        (value) => value !== ''
    );

    return (
        <Accordion>
            <AccordionSummary expandIcon={<FilterList />}>
                <Typography variant="h6">
                    Opções de Filtros {hasActiveFilters && '(ativos)'}
                </Typography>
            </AccordionSummary>

            <AccordionDetails>
                <Box sx={{ width: '100%' }}>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: 'repeat(2, 1fr)',
                                md: 'repeat(3, 1fr)',
                                lg: 'repeat(4, 1fr)',
                            },
                            gap: 2,
                        }}
                    >
                        <TextField
                            fullWidth
                            label="ID"
                            value={filters.id}
                            onChange={handleInputChange('id')}
                            placeholder="Buscar por ID..."
                            type="number"
                            size="small"
                        />

                        <TextField
                            fullWidth
                            label="Nome"
                            value={filters.nome}
                            onChange={handleInputChange('nome')}
                            placeholder="Buscar por nome..."
                            size="small"
                        />

                        <TextField
                            fullWidth
                            label="CPF"
                            value={filters.cpf}
                            onChange={handleInputChange('cpf')}
                            placeholder="Buscar por CPF..."
                            size="small"
                        />

                        <TextField
                            fullWidth
                            label="Telefone"
                            value={filters.telefone}
                            onChange={handleInputChange('telefone')}
                            placeholder="Buscar por telefone..."
                            size="small"
                        />

                        <FormControl fullWidth size="small">
                            <InputLabel>Grupo</InputLabel>
                            <Select
                                value={filters.grupo}
                                label="Grupo"
                                onChange={handleInputChange('grupo')}
                            >
                                <MenuItem value="">Todos</MenuItem>
                                <MenuItem value={1}>Administrador</MenuItem>
                                <MenuItem value={2}>Atendente</MenuItem>
                                <MenuItem value={3}>Caixa</MenuItem>
                            </Select>
                        </FormControl>

                        <Box
                            sx={{
                                gridColumn: {
                                    xs: '1 / -1',
                                    md: 'auto',
                                },
                                display: 'flex',
                                gap: 1,
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                            }}
                        >
                            <Button
                                variant="outlined"
                                startIcon={<Clear />}
                                onClick={handleClear}
                                disabled={!hasActiveFilters}
                                size="small"
                            >
                                Limpar
                            </Button>

                            <Button
                                variant="contained"
                                onClick={handleFilter}
                                size="small"
                            >
                                Filtrar
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </AccordionDetails>
        </Accordion>
    );
};

export default FuncionarioFilters;