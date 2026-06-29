from pathlib import Path

import fitz
import pytesseract
from PIL import Image


class OCRService:
    def extract_text(self, path: Path) -> str:
        suffix = path.suffix.lower()
        if suffix == ".pdf":
            return self._from_pdf(path)
        if suffix in {".jpg", ".jpeg", ".png"}:
            return str(pytesseract.image_to_string(Image.open(path)))
        raise ValueError("Unsupported file type")

    def _from_pdf(self, path: Path) -> str:
        parts: list[str] = []
        with fitz.open(path) as document:
            for page in document:
                page_text = page.get_text().strip()
                if page_text:
                    parts.append(page_text)
                    continue
                pixmap = page.get_pixmap(dpi=220)
                image = Image.frombytes("RGB", (pixmap.width, pixmap.height), pixmap.samples)
                parts.append(str(pytesseract.image_to_string(image)))
        return "\n".join(parts)
