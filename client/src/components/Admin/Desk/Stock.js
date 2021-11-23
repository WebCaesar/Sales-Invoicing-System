import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import {
  Autocomplete,
  Button,
  Box,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Paper,
  TextField,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';
import Swal from 'sweetalert2';

import DataGrid from 'components/Common/DataGrid';

const columns = [
  {
    id: 'index',
    label: '#',
  },
  {
    id: 'supplierCode',
    label: 'Supplier',
  },
  {
    id: 'model',
    label: 'Model',
  },
  {
    id: 'color',
    label: 'Color',
  },
  {
    id: 'armSize',
    label: 'Arm Size',
  },
  {
    id: 'feetSize',
    label: 'Feet Size',
  },
  {
    id: 'beamSize',
    label: 'Beam Size',
  },
  {
    id: 'topMaterial',
    label: 'topMaterial',
  },
  {
    id: 'topColor',
    label: 'topColor',
  },
  {
    id: 'topSize',
    label: 'topSize',
  },
  {
    id: 'balance',
    label: 'Balance',
  },
  {
    id: 'qty',
    label: 'QTY',
  },
  {
    id: 'shipmentDate',
    label: 'Shipment',
  },
  {
    id: 'arrivalDate',
    label: 'Arrival',
  },
  {
    id: 'edit',
    nonSort: true,
  },
  {
    id: 'delete',
    nonSort: true,
  },
];

function mapStateToProps(state) {
  const { auth } = state;
  return { auth };
}

const Stock = connect(mapStateToProps)((props) => {
  const theme = useTheme();
  const [stocks, setStocks] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const editForm = useRef(null);
  const createForm = useRef(null);
  const [formProps, setFormProps] = useState([]);

  const [id, setID] = useState('');
  const [filterAnchor, setFilterAnchor] = useState(null);

  const [balance, setBalance] = useState(0);
  const [shipmentQty, setShipmentQty] = useState(0);

  const handleFilterClick = (e) => {
    e.preventDefault();
    if (filterAnchor === null) setFilterAnchor(e.currentTarget);
    else setFilterAnchor(null);
  };

  const handleEditClick = (index) => {
    if (index < stocks.length && index >= 0) {
      setID(stocks[index].id);
      setFormProps([
        {
          name: 'supplierCode',
          label: 'Suppier',
          type: 'autocomplete',
          defaultValue: stocks[index].suppliderCode,
          options: ['AK', 'JC', 'AW', 'LK'],
          width: '30%',
        },
        {
          name: 'model',
          label: 'Model',
          type: 'text',
          defaultValue: stocks[index].model,
          width: '30%',
        },
        {
          name: 'color',
          label: 'Color',
          type: 'text',
          defaultValue: stocks[index].color,
          width: '30%',
        },
        {
          name: 'armSize',
          label: 'Arm Size',
          type: 'autocomplete',
          defaultValue: stocks[index].armSize,
          options: ['400', '500', '600'],
          width: '30%',
        },
        {
          name: 'feetSize',
          label: 'FeetSize',
          type: 'autocomplete',
          defaultValue: stocks[index].feetSize,
          options: ['400', '500', '600', '700'],
          width: '30%',
        },
        {
          name: 'beamSize',
          label: 'BeamSize',
          type: 'autocomplete',
          defaultValue: stocks[index].beamSize,
          options: ['740-1100', 'Regular'],
          width: '30%',
        },
        {
          name: 'topMaterial',
          label: 'Top Material',
          type: 'autocomplete',
          defaultValue: stocks[index].topMaterial,
          options: [
            'Melamine',
            'Laminate',
            'North American Walnut',
            'South American Walnut',
            'Red Oak',
            'Maple, Bamboo',
            'Melamine with glass top',
          ],
          width: '65%',
        },
        {
          name: 'topColor',
          label: 'Top Color',
          type: 'text',
          defaultValue: stocks[index].topColor,
          width: '30%',
        },
        {
          name: 'topSize',
          label: 'Top Size',
          type: 'text',
          defaultValue: stocks[index].topSize,
          width: '100%',
        },
        {
          name: 'remark',
          label: 'Remark',
          multiline: 'true',
          type: 'text',
          defaultValue: stocks[index].remark,
          width: '100%',
        },
        {
          name: 'shipmentDate',
          label: 'Shipment Date',
          type: 'date',
          width: '48%',
        },
        {
          name: 'arrivalDate',
          label: 'Arrival Date',
          type: 'date',
          width: '48%',
        },
      ]);
      setBalance(stocks[index].balance);
      setShipmentQty(stocks[index].qty);
    }
    setEditOpen(true);
  };

  const handleRemoveClick = (index) => {
    if (index < stocks.length && index >= 0) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'This action will remove current DeskStock permanently.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Remove!',
        cancelButtonText: 'No, Keep It.',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`/deskStock/${stocks[index].id}`)
            .then((response) => {
              // handle success
              getStocks();
            })
            .catch(function (error) {
              // handle error
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response.data.message,
                allowOutsideClick: false,
              });
              console.log(error);
            })
            .then(function () {
              // always executed
            });
        }
      });
    }
  };

  const handleBulkRemoveClick = (selected) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action will remove selected DeskStocks permanently.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Remove!',
      cancelButtonText: 'No, Keep Them.',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete('/deskStock', {
            data: { ids: selected },
          })
          .then((response) => {
            // handle success
            getStocks();
          })
          .catch(function (error) {
            // handle error
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.response.data.message,
              allowOutsideClick: false,
            });
            console.log(error);
          })
          .then(function () {
            // always executed
          });
      }
    });
  };

  const handleSave = (event) => {
    event.preventDefault();
    const data = new FormData(editForm.current);
    axios
      .put(`/deskStock/${id}`, {
        supplierCode: data.get('supplierCode'),
        model: data.get('model'),
        color: data.get('color'),
        armSize: data.get('armSize'),
        feetSize: data.get('feetSize'),
        beamSize: data.get('beamSize'),
        topMaterial: data.get('topMaterial'),
        topColor: data.get('topColor'),
        topSize: data.get('topSize'),
        remark: data.get('remark'),
        shipmentDate: data.get('shipmentDate') || null,
        arrivalDate: data.get('arrivalDate') || null,
        balance: balance,
        qty: balance + shipmentQty,
      })
      .then((response) => {
        // handle success
        setEditOpen(false);
        getStocks();
      })
      .catch(function (error) {
        // handle error
        setEditOpen(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          html: error.response.data.message.replace('\n', '<br />'),
          allowOutsideClick: false,
        }).then(() => {
          setEditOpen(true);
        });
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  const handleCreate = (event) => {
    event.preventDefault();
    const data = new FormData(createForm.current);
    axios
      .post(`/deskStock/create`, {
        supplierCode: data.get('supplierCode'),
        model: data.get('model'),
        color: data.get('color'),
        armSize: data.get('armSize'),
        feetSize: data.get('feetSize'),
        beamSize: data.get('beamSize'),
        topMaterial: data.get('topMaterial'),
        topColor: data.get('topColor'),
        topSize: data.get('topSize'),
        remark: data.get('remark'),
        shipmentDate: data.get('shipmentDate') || null,
        arrivalDate: data.get('arrivalDate') || null,
        balance: balance,
        qty: balance + shipmentQty,
      })
      .then((response) => {
        // handle success
        setCreateOpen(false);
        getStocks();
      })
      .catch(function (error) {
        // handle error
        setCreateOpen(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response.data.message,
          allowOutsideClick: false,
        }).then(() => {
          setCreateOpen(true);
        });
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  const getBrands = (cancelToken) => {
    axios
      .get('/chairBrand', { cancelToken })
      .then((response) => {
        // handle success
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  const getModels = (cancelToken) => {
    axios
      .get('/chairModel', { cancelToken })
      .then((response) => {
        // handle success
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  const getColors = (cancelToken) => {
    axios
      .get('/productColor', { cancelToken })
      .then((response) => {
        // handle success
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  const getChairRemarks = (cancelToken) => {
    // axios
    //   .get('/chairremark', { cancelToken })
    //   .then((response) => {
    //     // handle success
    //     setChairRemarks(response.data.map((item) => item.detail));
    //   })
    //   .catch(function (error) {
    //     // handle error
    //     console.log(error);
    //   })
    //   .then(function () {
    //     // always executed
    //   });
  };

  const getStocks = (cancelToken) => {
    axios
      .get('/deskStock', { cancelToken })
      .then((response) => {
        // handle success
        setStocks(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    getBrands(source.token);
    getModels(source.token);
    getColors(source.token);
    getStocks(source.token);
    getChairRemarks(source.token);
    return () => source.cancel('Stock Component got unmounted');
  }, []);

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => {
          setFormProps([
            {
              name: 'supplierCode',
              label: 'Suppier',
              type: 'autocomplete',
              options: ['AK', 'JC', 'AW', 'LK'],
              width: '30%',
            },
            {
              name: 'model',
              label: 'Model',
              type: 'text',
              width: '30%',
            },
            {
              name: 'color',
              label: 'Color',
              type: 'text',
              width: '30%',
            },
            {
              name: 'armSize',
              label: 'Arm Size',
              type: 'autocomplete',
              options: ['400', '500', '600'],
              width: '30%',
            },
            {
              name: 'feetSize',
              label: 'FeetSize',
              type: 'autocomplete',
              options: ['400', '500', '600', '700'],
              width: '30%',
            },
            {
              name: 'beamSize',
              label: 'BeamSize',
              type: 'autocomplete',
              options: ['740-1100', 'Regular'],
              width: '30%',
            },
            {
              name: 'topMaterial',
              label: 'Top Material',
              type: 'autocomplete',
              options: [
                'Melamine',
                'Laminate',
                'North American Walnut',
                'South American Walnut',
                'Red Oak',
                'Maple, Bamboo',
                'Melamine with glass top',
              ],
              width: '65%',
            },
            {
              name: 'topColor',
              label: 'Top Color',
              type: 'text',
              width: '30%',
            },
            {
              name: 'topSize',
              label: 'Top Size',
              type: 'text',
              width: '100%',
            },
            {
              name: 'remark',
              label: 'Remark',
              type: 'text',
              width: '100%',
            },
            {
              name: 'shipmentDate',
              label: 'Shipment Date',
              type: 'date',
              width: '48%',
            },
            {
              name: 'arrivalDate',
              label: 'Arrival Date',
              type: 'date',
              width: '48%',
            },
          ]);
          setBalance(0);
          setShipmentQty(0);
          setCreateOpen(true);
        }}
      >
        New Stock
      </Button>
      <DataGrid
        title="Chair Stocks"
        rows={stocks.map(
          (
            {
              withHeadrest,
              withAdArmrest,
              shipmentDate,
              arrivalDate,
              ...restProps
            },
            index
          ) => ({
            index,
            withHeadrest: withHeadrest ? 'Yes' : 'No',
            withAdArmrest: withAdArmrest ? 'Yes' : 'No',
            edit: (
              <IconButton
                onClick={(event) => {
                  event.preventDefault();
                  handleEditClick(index);
                }}
              >
                <EditIcon />
              </IconButton>
            ),
            delete: (
              <IconButton
                onClick={(event) => {
                  event.preventDefault();
                  handleRemoveClick(index);
                }}
              >
                <DeleteIcon />
              </IconButton>
            ),
            shipmentDate: (() => {
              if (shipmentDate === null) return 'No';
              const createdTime = new Date(shipmentDate);
              createdTime.setMinutes(
                createdTime.getMinutes() - createdTime.getTimezoneOffset()
              );
              return createdTime.toISOString().split('T')[0];
            })(),
            arrivalDate: (() => {
              if (arrivalDate === null) return 'No';
              const createdTime = new Date(arrivalDate);
              createdTime.setMinutes(
                createdTime.getMinutes() - createdTime.getTimezoneOffset()
              );
              return createdTime.toISOString().split('T')[0];
            })(),
            ...restProps,
          })
        )}
        columns={columns}
        onEditClick={handleEditClick}
        onRemoveClick={handleRemoveClick}
        onBulkRemoveClick={handleBulkRemoveClick}
        onFilterClick={handleFilterClick}
      ></DataGrid>
      <Dialog
        fullWidth
        fullScreen={useMediaQuery(theme.breakpoints.down('sm'))}
        maxWidth="sm"
        open={editOpen}
        PaperProps={{
          ref: editForm,
          component: 'form',
          onSubmit: handleSave,
        }}
      >
        <DialogTitle>Edit Stock</DialogTitle>
        <DialogContent>
          <Paper
            sx={{
              mt: '5px',
              p: '10px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            {formProps.map(({ type, width, ...restParams }, index) => {
              if (type === 'text') {
                return (
                  <TextField
                    key={index}
                    margin="dense"
                    variant="outlined"
                    size="small"
                    sx={{ flexBasis: width, minWidth: width }}
                    {...restParams}
                  />
                );
              } else if (type === 'date') {
                return (
                  <TextField
                    key={index}
                    margin="dense"
                    variant="outlined"
                    size="small"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    sx={{ flexBasis: width, minWidth: width }}
                    {...restParams}
                  />
                );
              } else if (type === 'autocomplete') {
                const { name, label, ...autocomParams } = restParams;
                return (
                  <Autocomplete
                    key={index}
                    options={['aa', 'ss']}
                    sx={{ flexBasis: width, minWidth: width }}
                    renderInput={(params) => (
                      <TextField
                        margin="dense"
                        {...params}
                        name={name}
                        label={label}
                        variant="outlined"
                        size="small"
                      />
                    )}
                    {...autocomParams}
                  />
                );
              } else return null;
            })}
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ flexBasis: '48%', minWidth: '48%' }}
            >
              <IconButton
                onClick={(event) => {
                  event.preventDefault();
                  setBalance(Math.max(0, balance - 1));
                }}
              >
                <RemoveIcon />
              </IconButton>
              <TextField
                margin="dense"
                label="Balance"
                variant="outlined"
                size="small"
                value={balance}
                type="number"
                sx={{ width: '80px', mx: '5px' }}
                onChange={(e) => {
                  setBalance(Math.max(0, e.target.value));
                }}
              />
              <IconButton
                onClick={(event) => {
                  event.preventDefault();
                  setBalance(balance + 1);
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ flexBasis: '48%', minWidth: '48%' }}
            >
              <IconButton
                onClick={(event) => {
                  event.preventDefault();
                  setShipmentQty(Math.max(0, shipmentQty - 1));
                }}
              >
                <RemoveIcon />
              </IconButton>
              <TextField
                margin="dense"
                label="Shipment"
                variant="outlined"
                size="small"
                value={shipmentQty}
                type="number"
                sx={{ width: '80px', mx: '5px' }}
                onChange={(e) => {
                  setShipmentQty(Math.max(0, e.target.value));
                }}
              />
              <IconButton
                onClick={(event) => {
                  event.preventDefault();
                  setShipmentQty(shipmentQty + 1);
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setEditOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth
        fullScreen={useMediaQuery(theme.breakpoints.down('sm'))}
        maxWidth="sm"
        open={createOpen}
        PaperProps={{
          ref: createForm,
          component: 'form',
          onSubmit: handleCreate,
        }}
      >
        <DialogTitle>New Stock</DialogTitle>
        <DialogContent>
          <Paper
            sx={{
              mt: '5px',
              p: '10px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            {formProps.map(({ type, width, ...restParams }, index) => {
              if (type === 'text') {
                return (
                  <TextField
                    key={index}
                    margin="dense"
                    variant="outlined"
                    size="small"
                    sx={{ flexBasis: width, minWidth: width }}
                    {...restParams}
                  />
                );
              } else if (type === 'date') {
                return (
                  <TextField
                    key={index}
                    margin="dense"
                    variant="outlined"
                    size="small"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    sx={{ flexBasis: width, minWidth: width }}
                    {...restParams}
                  />
                );
              } else if (type === 'checkbox') {
                const { defaultValue, label, name } = restParams;
                return (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox name={name} defaultChecked={defaultValue} />
                    }
                    label={label}
                    sx={{ flexBasis: width, minWidth: width }}
                  />
                );
              } else if (type === 'autocomplete') {
                const { name, label, ...autocomParams } = restParams;
                return (
                  <Autocomplete
                    key={index}
                    options={['aa', 'ss']}
                    sx={{ flexBasis: width, minWidth: width }}
                    renderInput={(params) => (
                      <TextField
                        margin="dense"
                        {...params}
                        name={name}
                        label={label}
                        variant="outlined"
                        size="small"
                      />
                    )}
                    {...autocomParams}
                  />
                );
              } else return null;
            })}
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ flexBasis: '48%', minWidth: '48%' }}
            >
              <IconButton
                onClick={() => {
                  setBalance(balance > 1 ? balance - 1 : 0);
                }}
              >
                <RemoveIcon />
              </IconButton>
              <TextField
                margin="dense"
                label="Balance"
                variant="outlined"
                size="small"
                value={balance}
                type="number"
                sx={{ width: '80px', mx: '5px' }}
                onChange={(e) => {
                  if (e.target.value > 0) setBalance(e.target.value);
                  else setBalance(0);
                }}
              />
              <IconButton
                onClick={() => {
                  setBalance(balance + 1);
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ flexBasis: '48%', minWidth: '48%' }}
            >
              <IconButton
                onClick={() => {
                  setShipmentQty(Math.max(shipmentQty - 1, 0));
                }}
              >
                <RemoveIcon />
              </IconButton>
              <TextField
                margin="dense"
                label="Shipment"
                variant="outlined"
                size="small"
                value={shipmentQty}
                type="number"
                sx={{ width: '80px', mx: '5px' }}
                onChange={(e) => {
                  setShipmentQty(Math.max(e.target.value, 0));
                }}
              />
              <IconButton
                onClick={() => {
                  setShipmentQty(shipmentQty + 1);
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setCreateOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default Stock;
