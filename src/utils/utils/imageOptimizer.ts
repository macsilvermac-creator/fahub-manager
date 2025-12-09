
export const compressImage = (file: File, maxWidth: number = 1024, quality: number = 0.8): Promise<File> => {
    return new Promise((resolve, reject) => {
        // Se não for imagem, retorna o arquivo original
        if (!file.type.match(/image.*/)) {
            resolve(file);
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Calcula novas dimensões mantendo proporção
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    resolve(file); // Fallback se canvas falhar
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);

                // Converte para Blob comprimido (JPEG web-friendly)
                canvas.toBlob((blob) => {
                    if (blob) {
                        const optimizedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        });
                        console.log(`📉 Imagem comprimida: ${(file.size / 1024).toFixed(2)}kb -> ${(optimizedFile.size / 1024).toFixed(2)}kb`);
                        resolve(optimizedFile);
                    } else {
                        reject(new Error('Falha na compressão da imagem'));
                    }
                }, 'image/jpeg', quality);
            };
            
            img.onerror = (error) => reject(error);
        };
        
        reader.onerror = (error) => reject(error);
    });
};
