import React from "react";
import {
  Page,
  Text,
  View,
  Image,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// @ts-ignore
import Poppings from "../../../fonts/Poppins/Poppins-Regular.ttf";
// @ts-ignore
import PoppingsMedium from "../../../fonts/Poppins/Poppins-Medium.ttf";
// @ts-ignore
import PoppingsSemiBold from "../../../fonts/Poppins/Poppins-SemiBold.ttf";
// @ts-ignore
import PoppingsBold from "../../../fonts/Poppins/Poppins-Bold.ttf";
import ksu_logo from "../../../image/ksu-logo.png";

const ResultRowData = ({
  name,
  matric,
  ca,
  level,
  exam,
  total,
  grade,
  department,
  sn,
}: any) => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        borderTop: "1px solid #000",
        borderBottom: "1px solid #000",
        borderLeft: "1px solid #000",
        borderRight: "1px solid #000",
      }}
    >
      <Text style={[styles.table_body, { width: "4%", textAlign: "center" }]}>
        {sn + 1}.
      </Text>
      <span style={{ borderLeft: "1px solid #000" }} />
      <Text style={[styles.table_body, { width: "28%" }]}>{name}</Text>
      <span style={{ borderLeft: "1px solid #000" }} />
      <Text
        style={[
          styles.table_body,
          { textTransform: "uppercase", width: "12%" },
        ]}
      >
        {matric}
      </Text>
      <span style={{ borderLeft: "1px solid #000" }} />
      <Text style={[styles.table_body, { width: "6%" }]}>{level}</Text>
      <span style={{ borderLeft: "1px solid #000" }} />
      <Text style={[styles.table_body, { width: "24%" }]}>
        {department && department.length > 20
          ? department.slice(0, 17).concat("", "...")
          : department}
      </Text>
      <span style={{ borderLeft: "1px solid #000" }} />
      <Text style={[styles.table_body, { width: "5%", textAlign: "center" }]}>
        {ca}
      </Text>
      <span style={{ borderLeft: "1px solid #000" }} />
      <Text style={[styles.table_body, { width: "13%", textAlign: "center" }]}>
        {exam}
      </Text>
      <span style={{ borderLeft: "1px solid #000" }} />
      <Text style={[styles.table_body, { width: "6%", textAlign: "center" }]}>
        {total}
      </Text>
      <span style={{ borderLeft: "1px solid #000" }} />
      <Text style={[styles.table_body, { width: "6%", textAlign: "center" }]}>
        {grade}
      </Text>
    </View>
  );
};

export const PDFResultView = ({
  results,
  examTitle,
}: {
  results: any;
  examTitle: string;
}) => {
  const faculty = results
    .map((dta: any) => dta.faculty)
    .filter(
      (value: any, index: number, self: any) => self.indexOf(value) === index
    );

  return (
    <Document>
      {faculty.map((fac: string, index: number) => (
        <Page style={styles.body} key={index}>
          <Image style={styles.image} src={ksu_logo} />

          <Text style={[styles.title, { textTransform: "uppercase" }]}>
            Prince Abubakar Audu University, Anyigba
          </Text>
          <View>
            <Text style={[styles.title, { textTransform: "uppercase" }]}>
              E-Examination
            </Text>

            <Text
              style={[
                styles.title,
                {
                  textTransform: "uppercase",
                  fontSize: 16,
                  marginTop: 10,
                  marginBottom: 30,
                },
              ]}
            >
              {examTitle} (2019/2020)
            </Text>
          </View>

          <Text style={[styles.faculty, { textTransform: "uppercase" }]}>
            Faculty:{"  "} {fac}
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              border: "1px solid #000",
              // height: 32,

              // paddingHorizontal: ,
            }}
          >
            <Text style={[styles.table_head, { width: "4%" }]}>S/N</Text>
            <span style={{ borderLeft: "1px solid #000" }} />
            <Text style={[styles.table_head, { width: "28%" }]}>NAME</Text>
            <span style={{ borderLeft: "1px solid #000" }} />
            <Text style={[styles.table_head, { width: "12%" }]}>MATRIC.NO</Text>
            <span style={{ borderLeft: "1px solid #000" }} />
            <Text style={[styles.table_head, { width: "6%" }]}>LEVEL</Text>
            <span style={{ borderLeft: "1px solid #000" }} />
            <Text style={[styles.table_head, { width: "24%" }]}>
              DEPARTMENT
            </Text>
            <span style={{ borderLeft: "1px solid #000" }} />
            <Text style={[styles.table_head, { width: "5%" }]}>CA</Text>
            <span style={{ borderLeft: "1px solid #000" }} />
            <Text style={[styles.table_head, { width: "13%" }]}>
              EXAMINATION
            </Text>
            <span style={{ borderLeft: "1px solid #000" }} />
            <Text style={[styles.table_head, { width: "6%" }]}>TOTAL</Text>
            <span style={{ borderLeft: "1px solid #000" }} />
            <Text style={[styles.table_head, { width: "6%" }]}>Grade</Text>
          </View>

          {results
            .filter((result: any) => result.faculty === fac)
            .map((result: any, index: number) => (
              <ResultRowData {...result} key={index} sn={index} />
            ))}

          <View style={styles.personel}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div style={{ width: 150, borderBottom: "1px solid #000" }}></div>
              <Text style={styles.personel_text}>E-Examination Chairman</Text>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div style={{ width: 150, borderBottom: "1px solid #000" }}></div>
              <Text style={styles.personel_text}>GST Coordinator</Text>
            </div>
          </View>

          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
            fixed
          />
        </Page>
      ))}
    </Document>
  );
};

Font.register({
  family: "Poppins",
  fonts: [
    {
      fontStyle: "normal",
      fontWeight: "normal",
      src: Poppings,
    },
    {
      fontStyle: "normal",
      fontWeight: 500,
      src: PoppingsMedium,
    },
    {
      fontStyle: "normal",
      fontWeight: 600,
      src: PoppingsSemiBold,
    },
    {
      fontStyle: "normal",
      fontWeight: "bold",
      src: PoppingsBold,
    },
  ],
});

const styles = StyleSheet.create({
  view: { display: "flex" },
  body: {
    fontFamily: "Poppins",
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 30,
  },
  title: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    // fontWeight: 500,
    fontSize: 12,
    textAlign: "center",
    // marginBottom: 20,
  },
  faculty: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    // fontWeight: 500,
    fontSize: 12,
    // textAlign: "center",
    marginBottom: 10,
  },
  table_head: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 8,
    textTransform: "uppercase",
    paddingHorizontal: 2,
    textAlign: "center",
    paddingVertical: 6,
  },
  table_body: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 10,
    textTransform: "capitalize",
    paddingHorizontal: 4,
    paddingVertical: 7.543,
  },
  personel: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 50,
  },
  personel_text: {
    fontFamily: "Poppins",
    fontSize: 12,
    marginTop: 4,
    // textAlign: "center",
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 230,
    width: 70,
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
});

// export const PDFView = () => (
//   <div>
//     <PDFDownloadLink document={<PDFResultView />} fileName="somename.pdf">
//       {({ blob, url, loading, error }) =>
//         loading ? "Loading result..." : "Download now!"
//       }
//     </PDFDownloadLink>
//   </div>
// );

// export const PDFView = () => (
//   <div>
//     <PDFViewer>
//       <Quixote />
//     </PDFViewer>
//   </div>
// );

// ReactPDF.render(<Quixote />);
