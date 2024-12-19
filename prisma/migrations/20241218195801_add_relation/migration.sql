-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "passhasheada" TEXT NOT NULL,
    "puedeescribir" BOOLEAN NOT NULL,
    "linkautor" TEXT,
    "tokenEmail" TEXT,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "noticias" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "authorId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "likes" INTEGER,

    CONSTRAINT "noticias_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "noticias" ADD CONSTRAINT "noticias_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
