export const toBase64 = (file: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      const res = reader.result + "";
      let t = res.split(";");
      t = t[1].split(",");

      resolve(t[1]);
    };
    reader.onerror = (error) => reject(error);
  });
