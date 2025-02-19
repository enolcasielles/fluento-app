import { CustomError } from "../errors";
import { supabase } from "./supabase";

interface UploadAudioProps {
  buffer: Buffer;
  path: string;
}

export async function uploadAudio({
  buffer,
  path,
}: UploadAudioProps): Promise<string> {
  try {
    const { data, error } = await supabase.storage
      .from("audios")
      .upload(path, buffer, {
        contentType: "audio/mpeg",
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new CustomError({
        message: "Error al subir el audio",
      });
    }

    // Obtener la URL pública del archivo
    const {
      data: { publicUrl },
    } = supabase.storage.from("audios").getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError({
      message: "Error al guardar el audio",
    });
  }
}

interface UploadImageProps {
  buffer: Buffer;
  path: string;
}

export async function uploadImage({
  buffer,
  path,
}: UploadImageProps): Promise<string> {
  try {
    const { data, error } = await supabase.storage
      .from("images")
      .upload(path, buffer, {
        contentType: "image/jpeg",
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new CustomError({
        message: "Error al subir la imagen",
      });
    }

    // Obtener la URL pública del archivo
    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError({
      message: "Error al guardar la imagen",
    });
  }
}
