const CLOUD_NAME = "dz2tdrz8t";
const UPLOAD_PRESET = "albarra_menu";

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Falha ao enviar imagem");
  }

  const data = await res.json();
  return data.secure_url;
}
