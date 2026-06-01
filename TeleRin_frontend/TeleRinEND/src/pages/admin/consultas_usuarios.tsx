import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
function Consultas() {
  //estos son los datos usados para construir la tabla de  historias
  const columnas = [
    {
      name: "Historia",
      selector: (row) => row.historia,
    },
    {
      name: "Visitas",
      selector: (row) => row.visitas,
    },
    {
      name: "Corazones",
      selector: (row) => row.corazones,
    },
  ];
  const datos = [{ historia: "nombre de una historia", visitas: 15, corazones: 10 }];
  return (
    <div className="lg:flex lg:flex-row w-full h-full mt-10">
      <div className="lg:w-[50%] lg:mt-10">
        <DataTable columns={columnas} data={datos} />
      </div>
      <div className="lg:w-[40%] lg:mt-10 mt-10">
        <ResponsiveContainer width="100%" aspect={2}>
          <BarChart
            data={datos}
            width={50}
            height={20}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="4 1 2" />
            <XAxis dataKey="historia" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="visitas" fill="#6b48ff" />
            <Bar dataKey="corazones" fill="#1ee3cf" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
export default Consultas;
