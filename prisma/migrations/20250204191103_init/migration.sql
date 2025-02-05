-- CreateTable
CREATE TABLE "usuarios" (
    "usua_id" SERIAL NOT NULL,
    "usua_ruc" VARCHAR(13) NOT NULL,
    "usua_nombre" VARCHAR(255) NOT NULL,
    "usua_apellido" VARCHAR(255) NOT NULL,
    "usua_email" VARCHAR(255) NOT NULL,
    "usua_celular" VARCHAR(10) NOT NULL,
    "usua_direccion" TEXT,
    "usua_contrasenia" VARCHAR(255) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("usua_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_usua_ruc_key" ON "usuarios"("usua_ruc");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_usua_email_key" ON "usuarios"("usua_email");
