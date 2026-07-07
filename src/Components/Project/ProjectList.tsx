import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import axios from 'axios';
import { IProject } from '../../Interfaces/IProject';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';


import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import "./Project.css";
import { AddBoxTwoTone } from '@mui/icons-material';
import { ApiUrl } from '../../ApiData/ApiUrl';
import { useEffect } from 'react';

interface ProjectList {
    
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
        event: React.MouseEvent<HTMLButtonElement>,
        newPage: number,
    ) => void;
}

const URL = new ApiUrl();

// get token from localstorage
const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
};

let rows: IProject[] = [];

function TablePaginationActions(props: ProjectList) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };
    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={ handleBackButtonClick }
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

 

  export function FormDialog() {

    const [open, setOpen] = React.useState(false);
  
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleCancel = () => {
      setOpen(false);
    };
    const handleClose = () => {
        axios.post(`${URL.baseUrl}/project/creates`, {title: titre,type:type,description:desc,status:statut,bigindate:daty1,enddate:daty2},config).then(res => {
            console.log(res.data);
            setOpen(false);
        });
      setOpen(false);
    };

    // get type
    const [type, setType] = React.useState('');
    const handleChangeType = (event: SelectChangeEvent) => {
      setType(event.target.value as string);
    };
    // get statut
    const [statut, setStatut] = React.useState('');
    const handleChangeStatut = (event: SelectChangeEvent) => {
        setStatut(event.target.value as string);
    };

    const [titre, setTitre] = React.useState('');
    const handleTextTitreChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setTitre(event.target.value);
    };

    const [desc, setDesc] = React.useState('');
    const handleTextDescChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setDesc(event.target.value);
    };

    const [daty1, setDaty1] = React.useState<Dayjs | null>(dayjs('2022-10-22'));
    const [daty2, setDaty2] = React.useState<Dayjs | null>(dayjs('2022-10-22'));
   
    return (
      <div>
        <Button color="info" onClick={handleClickOpen}   sx={{top:2}}>
          <IconButton> <AddBoxTwoTone fontSize="medium" color="primary" /> </IconButton>Ajouter 
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Subscribe</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Formulaire permet de créer nouveau projet
            </DialogContentText>

            <TextField placeholder="Titre du projet" 
            value={titre}
            onChange={ handleTextTitreChange}
            autoFocus
            margin="dense"
            id="name"
            label="Titre"
            type="text"
            fullWidth
            variant="standard"
          />
          <InputLabel id="type-id">Type du projet</InputLabel>
            <Select
            defaultValue='Nouvel fonctionnalité'
            margin="dense"
            variant="standard"
            labelId="type-id"
            id="demo-simple-select"
            value={type}
            label="Type"
            onChange={handleChangeType}
            >
            <MenuItem value={'Nouvel fonctionnalité'}>Nouvel fonctionnalité</MenuItem>
            <MenuItem value={'Débogage'}>Débogage</MenuItem>
            </Select>

            <InputLabel id="type-id">Statut du projet</InputLabel>
            <Select
            defaultValue='EN COURS'
            margin="dense"
            variant="standard"
            labelId="type-id"
            id="demo-simple-select"
            value={statut}
            label="Type"
            onChange={handleChangeStatut}
            >
            <MenuItem value={'EN COURS'}>EN COURS</MenuItem>
            <MenuItem value={'EN ATTENTE'}>EN ATTENTE</MenuItem>
            <MenuItem value={'CLOTURER'}>CLOTURER</MenuItem>
            </Select>

            <TextField placeholder="Description du projet" 
            value= {desc}
            onChange= { handleTextDescChange }
            autoFocus
            margin="dense"
            id="name"
            label="Description ..."
            type="text"
            fullWidth
            variant="standard" />
          
          <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker className='daty'
                    
                    label="Date de début"
                    value={daty1}
                    onChange={(newValue) => {
                    setDaty1(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} fullWidth variant="standard"  margin="dense"/>}
                />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker className='daty'
                    label="Date de limite"
                    value={daty2}
                    onChange={(newValue) => {
                    setDaty2(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} fullWidth variant="standard"  margin="dense"/>}
                />
            </LocalizationProvider>
          
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel}>Annuler</Button>
            <Button onClick={handleClose}>Sauvegardée</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
  

 async function getData() {
   const response = await axios.get(`https://127.0.0.1:8000/api/project/list`, config);
   rows=response.data;
   console.log('rows', rows);
   return response.data;
}

export default function CustomPaginationActionsTable() {
    useEffect(() => {
        getData()
    });
    const [page, setPage] = React.useState(0);

    const [rowsPerPage, setRowsPerPage] = React.useState(0);
    
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        getData();
        setRowsPerPage(parseInt(event.target.value, 5));
        setPage(0);
    };

    return (

        <TableContainer component={Paper}>
            <div className="">
                <FormDialog />
                  <Paper
                        component="form"
                        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400, float: 'right', top:1}}
                        >
                        <IconButton sx={{ p: '10px' }} aria-label="menu">
                            <MenuIcon />
                        </IconButton>
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Recherche"
                            inputProps={{ 'aria-label': 'search google maps' }}
                        />
                        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                            <SearchIcon />
                        </IconButton>
                        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                </Paper>
            </div>
            <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                <TableRow>
                    <TableCell component="th" scope="row">
                        ID
                    </TableCell>
                    <TableCell>
                        Titre
                    </TableCell>
                    <TableCell >
                        Type
                    </TableCell>
                    <TableCell>
                        Description
                    </TableCell>
                    <TableCell>
                        Statut
                    </TableCell>
                    <TableCell>
                        Date debut
                    </TableCell>
                    <TableCell>
                        Date limite
                    </TableCell>
                    <TableCell>
                        Action
                    </TableCell>
                </TableRow>
                <TableBody>
                    {(rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows).map((row) => (
                        <TableRow key={row.project_id}>
                            <TableCell component="th" scope="row">
                                {row.project_id}
                            </TableCell>
                            <TableCell >
                                {row.project_title}
                            </TableCell>
                            <TableCell>
                                {row.project_type}
                            </TableCell>
                            <TableCell >
                                {row.project_description}
                            </TableCell>
                            <TableCell >
                                {row.project_status}
                            </TableCell>
                            <TableCell >
                                {row.project_bigindate}
                            </TableCell>
                            <TableCell >
                                {row.project_enddate}
                            </TableCell>
                            <TableCell >
                                <IconButton>
                                    <EditTwoToneIcon fontSize="medium" color="primary" />
                                </IconButton>
                                <IconButton>
                                    <DeleteTwoToneIcon fontSize="medium" color="error" />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                    {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                            <TableCell colSpan={3} />
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                            colSpan={7}
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            SelectProps={{
                                inputProps: {
                                    'aria-label': 'rows per page',
                                },
                                native: true,
                            }}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    );
}
