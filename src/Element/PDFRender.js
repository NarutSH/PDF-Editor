import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const PDFRender = ({ base64 }) => {
  const styles = StyleSheet.create({
    body: {
      paddingTop: 0,
      paddingBottom: 0,
      paddingHorizontal: 0,
    },
    image: {
      marginVertical: 0,
      marginHorizontal: 0,
    },
  });

  return (
    <Document>
      {base64.length
        ? base64.map((item) => {
            return (
              <Page size="A4" style={styles.body} wrap>
                <Image style={styles.image} src={item.data64} />
              </Page>
            );
          })
        : ""}
    </Document>
  );
};

export default PDFRender;
