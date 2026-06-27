import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Typography
} from '@mui/material';

import { PhotoCamera as PhotoCameraIcon } from '@mui/icons-material';

import PageLayout from "../components/common/PageLayout";
import DuplicateValidator from "../components/common/DuplicateValidator";

import { useValidationRules } from '../hooks/useValidationRules';
import { produtoService } from '../services/produtoService';
import { useSnackbar } from '../hooks/useSnackbar';

// Definição do componente ProdutoForm
const ProdutoForm = () => {
  const { id, opr } = useParams();
  const navigate = useNavigate();

  const { showSnackbar } = useSnackbar();

  const {
    control,
    handleSubmit,
    formState: {
      errors,
      dirtyFields
    },
    reset,
    getValues,
    setValue
  } = useForm();

  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [duplicateDialog, setDuplicateDialog] = useState({
    open: false,
    produto: null
  });

  const validationRules = useValidationRules();

  const isReadOnly = opr === 'view';

  const title = opr === 'view'
    ? `Visualizar Produto: ${id}`
    : id
      ? `Editar Produto: ${id}`
      : 'Novo Produto';

  // Validação de nome duplicado
  const validateDuplicateName = async (nomeProduto) => {
    if (!nomeProduto || isReadOnly) {
      return;
    }

    try {
      const response = await produtoService.list({
        nome: nomeProduto,
        skip: 0,
        limit: 100
      });

      const produtosEncontrados = response.data || response;

      const produtoDuplicado = produtosEncontrados.find((produto) => {
        const mesmoNome =
          produto.nome?.trim().toLowerCase() === nomeProduto.trim().toLowerCase();

        const naoEhOProdutoAtual = !id || Number(produto.id) !== Number(id);

        return mesmoNome && naoEhOProdutoAtual;
      });

      if (produtoDuplicado) {
        setDuplicateDialog({
          open: true,
          produto: produtoDuplicado
        });
      }
    } catch (error) {
      showSnackbar("Erro ao validar nome do produto.", "error");
    }
  };

  const handleCloseDuplicateDialog = () => {
    setDuplicateDialog({
      open: false,
      produto: null
    });

    setValue("nome", "");
  };

  const handleViewDuplicate = () => {
    const produto = duplicateDialog.produto;

    setDuplicateDialog({
      open: false,
      produto: null
    });

    if (produto?.id) {
      navigate(`/produto/view/${produto.id}`);
    }
  };

  const handleEditDuplicate = () => {
    const produto = duplicateDialog.produto;

    setDuplicateDialog({
      open: false,
      produto: null
    });

    if (produto?.id) {
      navigate(`/produto/edit/${produto.id}`);
    }
  };

  // Funções de manipulação de imagem
  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      try {
        const resizedFile = await resizeImage(file);

        setFoto(resizedFile);

        const previewUrl = URL.createObjectURL(resizedFile);
        setFotoPreview(previewUrl);
      } catch (error) {
        showSnackbar("Erro ao redimensionar a imagem.", "error");
      }
    } else {
      setFoto(null);
      setFotoPreview(null);
    }
  };

  const resizeImage = (
    file,
    maxWidth = 100,
    maxHeight = 100,
    quality = 0.7
  ) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(
            maxWidth / width,
            maxHeight / height
          );

          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          const resizedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          });

          resolve(resizedFile);
        }, file.type, quality);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = (error) => reject(error);
    });
  };

  const handleCancel = () => {
    navigate('/produtos');
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      await validateDuplicateName(data.nome);

      if (foto instanceof File) {
        try {
          const base64 = await fileToBase64(foto);
          data.foto = base64;
        } catch (error) {
          showSnackbar('Erro ao processar a foto', 'error');
          return;
        }
      } else if (!id) {
        data.foto = "";
      }

      let retorno;

      if (id) {
        const changedData = {};

        Object.keys(dirtyFields).forEach((key) => {
          if (dirtyFields[key]) {
            changedData[key] = data[key];
          }
        });

        if (foto instanceof File) {
          changedData.foto = data.foto;
        }

        if (Object.keys(changedData).length === 0) {
          showSnackbar('Nenhuma alteração detectada', 'info');
          return;
        }

        retorno = await produtoService.update(id, changedData);

        showSnackbar('Produto atualizado com sucesso!', 'success');
      } else {
        retorno = await produtoService.create(data);

        showSnackbar('Produto criado com sucesso!', 'success');
      }

      if (!retorno?.id) {
        throw new Error(retorno.detail || "Erro ao salvar produto.");
      }

      navigate('/produtos');
    } catch (error) {
      const mensagem = error.apiMessage || 'Erro ao salvar produto';
      showSnackbar(mensagem, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadProduto = async () => {
      if (id) {
        try {
          setLoadingData(true);

          const data = await produtoService.getById(id);

          reset(data);

          if (data.foto) {
            setFoto(data.foto);
            setFotoPreview(data.foto);
          }
        } catch (error) {
          showSnackbar('Erro ao carregar produto', 'error');
          navigate('/produtos');
        } finally {
          setLoadingData(false);
        }
      } else {
        setLoadingData(false);
      }
    };

    loadProduto();
  }, [id, navigate, reset, showSnackbar]);

  return (
    <PageLayout title={title}>
      {loadingData ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            p: 4
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          {opr === 'view' && (
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ mb: 2 }}
            >
              Todos os campos estão em modo somente leitura.
            </Typography>
          )}

          <Controller
            name="nome"
            control={control}
            defaultValue=""
            rules={validationRules.nome}
            render={({ field }) => (
              <TextField
                {...field}
                disabled={isReadOnly}
                label="Nome"
                fullWidth
                margin="normal"
                error={!!errors.nome}
                helperText={errors.nome?.message}
                onBlur={async () => {
                  field.onBlur();
                  await validateDuplicateName(getValues("nome"));
                }}
              />
            )}
          />

          <Controller
            name="descricao"
            control={control}
            defaultValue=""
            rules={validationRules.descricao}
            render={({ field }) => (
              <TextField
                {...field}
                disabled={isReadOnly}
                label="Descrição"
                fullWidth
                margin="normal"
                multiline
                rows={3}
                error={!!errors.descricao}
                helperText={errors.descricao?.message}
              />
            )}
          />

          <Controller
            name="valor_unitario"
            control={control}
            defaultValue=""
            rules={validationRules.valor_unitario}
            render={({ field }) => (
              <TextField
                {...field}
                disabled={isReadOnly}
                label="Valor Unitário"
                fullWidth
                margin="normal"
                type="number"
                inputProps={{
                  step: "0.01",
                  min: "0"
                }}
                error={!!errors.valor_unitario}
                helperText={errors.valor_unitario?.message}
              />
            )}
          />

          <Box sx={{ mt: 2 }}>
            <input
              id="foto-upload"
              name="foto-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isReadOnly}
            />

            <label htmlFor="foto-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<PhotoCameraIcon />}
                fullWidth
                disabled={isReadOnly}
              >
                {id ? 'Alterar Foto' : 'Selecionar Foto'}
              </Button>
            </label>
          </Box>

          {fotoPreview ? (
            <Box sx={{ mt: 2 }}>
              <img
                src={fotoPreview}
                alt="Pré-visualização do produto"
                style={{
                  maxWidth: '100%',
                  maxHeight: '200px',
                  borderRadius: '8px'
                }}
              />
            </Box>
          ) : (
            <Box sx={{ mt: 2 }}>
              Sem foto
            </Box>
          )}

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mt: 3
            }}
          >
            <Button
              sx={{ mr: 1 }}
              onClick={handleCancel}
              disabled={loading}
            >
              Cancelar
            </Button>

            {!isReadOnly && (
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
              >
                {loading
                  ? 'Salvando...'
                  : id
                    ? 'Atualizar'
                    : 'Cadastrar'}
              </Button>
            )}
          </Box>
        </Box>
      )}

      <DuplicateValidator
        open={duplicateDialog.open}
        title="Produto já cadastrado"
        message={
          duplicateDialog.produto
            ? `Já existe um produto cadastrado com o nome "${duplicateDialog.produto.nome}".`
            : "Já existe um produto cadastrado com este nome."
        }
        onClose={handleCloseDuplicateDialog}
        onView={handleViewDuplicate}
        onEdit={handleEditDuplicate}
      />
    </PageLayout>
  );
};

export default ProdutoForm;