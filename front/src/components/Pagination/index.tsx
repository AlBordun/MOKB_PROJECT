
import * as React from 'react';

import TablePagination from '@mui/material/TablePagination';
import {useEffect, useState} from "react";
import axios from "axios";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;
import {Theme} from "@mui/system";
import { makeStyles } from '@mui/material';
import {Patient} from "../Patient/Patient";

// const pageSize = 10;
interface AppPaginationProps {
    count: number;
    patients : Patient[];
}


export default function AppPagination({count,patients}: AppPaginationProps) {
    const [dense, setDense] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [selected, setSelected] = React.useState<readonly number[]>([]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = patients.map((patient) => patient.id as number);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: readonly number[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };

    const displayedPatients = patients.slice(page * rowsPerPage, (page + 1) * rowsPerPage)

    return (
        <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            component="div"
            count={count}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
        />
    );

}

//     const [pagination, setPagination] = useState({
//         count: 0,
//         from: 0,
//         to: pageSize
//     })
//
//     useEffect(() => {
//         service.getData({from: pagination.from, to: pagination.to}).then(response => {
//             console.log(response);
//             setPagination({...pagination, count: response.count});
//             console.log(response);
//         })
//     }, [pagination.from,pagination.to]);
// const handlePageChange = (event, page) => {
//
//     const from = (page -1) * pageSize;
//     const to = (page - 1) * pageSize + pageSize;
//
//     setPagination({... pagination, from: from, to: to});
// }
//     return (
//         <Box justifyContent={"center"} alignItems="right" display={"flex"}
//              sx={{
//                  margin: "20 px 0px"
//              }}
//         >
//             <Pagination
//                 count={Math.cell(pagination.count / pageSize)}
//                 onChange={handlePageChange }
//             />
//         </Box>
//
//     )