"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialize1685458723247 = void 0;
class initialize1685458723247 {
    constructor() {
        this.name = 'initialize1685458723247';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "image" character varying, "bio" text, "created_at" TIMESTAMP NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP DEFAULT now(), CONSTRAINT "unique_email_idx" UNIQUE ("email"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "unique_username_idx" UNIQUE ("username"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "comments" ("id" SERIAL NOT NULL, "body" character varying NOT NULL, "author_id" integer NOT NULL, "article_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "tags" ("id" SERIAL NOT NULL, "tag_name" character varying NOT NULL, CONSTRAINT "unique_tag_name_idx" UNIQUE ("tag_name"), CONSTRAINT "UQ_2df8d47c78b4eee8ed46c729f58" UNIQUE ("tag_name"), CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "articles" ("id" SERIAL NOT NULL, "slug" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "body" character varying NOT NULL, "author_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT 'NOW()', "updated_at" TIMESTAMP DEFAULT now(), CONSTRAINT "unique_article_slug_idx" UNIQUE ("slug"), CONSTRAINT "UQ_1123ff6815c5b8fec0ba9fec370" UNIQUE ("slug"), CONSTRAINT "PK_0a6e2c450d83e0b6052c2793334" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "tokens" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "unique_user_id_token_idx" UNIQUE ("user_id"), CONSTRAINT "UQ_8769073e38c365f315426554ca5" UNIQUE ("user_id"), CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "profile_followers" ("following_id" integer NOT NULL, "follower_id" integer NOT NULL, CONSTRAINT "PK_ae3160da7cf4c0a8f050274bb2d" PRIMARY KEY ("following_id", "follower_id"))`);
            yield queryRunner.query(`CREATE INDEX "IDX_8c4592166fc271e5f729287427" ON "profile_followers" ("following_id") `);
            yield queryRunner.query(`CREATE INDEX "IDX_b29d23400ca7ff75844828592c" ON "profile_followers" ("follower_id") `);
            yield queryRunner.query(`CREATE TABLE "article_tags" ("article_id" integer NOT NULL, "tag_id" integer NOT NULL, CONSTRAINT "PK_dd79accc42e2f122f6f3ff7588a" PRIMARY KEY ("article_id", "tag_id"))`);
            yield queryRunner.query(`CREATE INDEX "IDX_f8c9234a4c4cb37806387f0c9e" ON "article_tags" ("article_id") `);
            yield queryRunner.query(`CREATE INDEX "IDX_1325dd0b98ee0f8f673db6ce19" ON "article_tags" ("tag_id") `);
            yield queryRunner.query(`CREATE TABLE "article_favorites" ("article_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_31af347dc5116ca4092699a9c83" PRIMARY KEY ("article_id", "user_id"))`);
            yield queryRunner.query(`CREATE INDEX "IDX_19fa0bc90b91678cc4d30e3737" ON "article_favorites" ("article_id") `);
            yield queryRunner.query(`CREATE INDEX "IDX_8d1bc602f86930d0b609972221" ON "article_favorites" ("user_id") `);
            yield queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_e6d38899c31997c45d128a8973b" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_e9b498cca509147e73808f9e593" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "articles" ADD CONSTRAINT "FK_6515da4dff8db423ce4eb841490" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "profile_followers" ADD CONSTRAINT "FK_8c4592166fc271e5f7292874272" FOREIGN KEY ("following_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
            yield queryRunner.query(`ALTER TABLE "profile_followers" ADD CONSTRAINT "FK_b29d23400ca7ff75844828592c9" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
            yield queryRunner.query(`ALTER TABLE "article_tags" ADD CONSTRAINT "FK_f8c9234a4c4cb37806387f0c9e9" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
            yield queryRunner.query(`ALTER TABLE "article_tags" ADD CONSTRAINT "FK_1325dd0b98ee0f8f673db6ce194" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
            yield queryRunner.query(`ALTER TABLE "article_favorites" ADD CONSTRAINT "FK_19fa0bc90b91678cc4d30e37375" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
            yield queryRunner.query(`ALTER TABLE "article_favorites" ADD CONSTRAINT "FK_8d1bc602f86930d0b609972221a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "article_favorites" DROP CONSTRAINT "FK_8d1bc602f86930d0b609972221a"`);
            yield queryRunner.query(`ALTER TABLE "article_favorites" DROP CONSTRAINT "FK_19fa0bc90b91678cc4d30e37375"`);
            yield queryRunner.query(`ALTER TABLE "article_tags" DROP CONSTRAINT "FK_1325dd0b98ee0f8f673db6ce194"`);
            yield queryRunner.query(`ALTER TABLE "article_tags" DROP CONSTRAINT "FK_f8c9234a4c4cb37806387f0c9e9"`);
            yield queryRunner.query(`ALTER TABLE "profile_followers" DROP CONSTRAINT "FK_b29d23400ca7ff75844828592c9"`);
            yield queryRunner.query(`ALTER TABLE "profile_followers" DROP CONSTRAINT "FK_8c4592166fc271e5f7292874272"`);
            yield queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "FK_6515da4dff8db423ce4eb841490"`);
            yield queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_e9b498cca509147e73808f9e593"`);
            yield queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_e6d38899c31997c45d128a8973b"`);
            yield queryRunner.query(`DROP INDEX "public"."IDX_8d1bc602f86930d0b609972221"`);
            yield queryRunner.query(`DROP INDEX "public"."IDX_19fa0bc90b91678cc4d30e3737"`);
            yield queryRunner.query(`DROP TABLE "article_favorites"`);
            yield queryRunner.query(`DROP INDEX "public"."IDX_1325dd0b98ee0f8f673db6ce19"`);
            yield queryRunner.query(`DROP INDEX "public"."IDX_f8c9234a4c4cb37806387f0c9e"`);
            yield queryRunner.query(`DROP TABLE "article_tags"`);
            yield queryRunner.query(`DROP INDEX "public"."IDX_b29d23400ca7ff75844828592c"`);
            yield queryRunner.query(`DROP INDEX "public"."IDX_8c4592166fc271e5f729287427"`);
            yield queryRunner.query(`DROP TABLE "profile_followers"`);
            yield queryRunner.query(`DROP TABLE "tokens"`);
            yield queryRunner.query(`DROP TABLE "articles"`);
            yield queryRunner.query(`DROP TABLE "tags"`);
            yield queryRunner.query(`DROP TABLE "comments"`);
            yield queryRunner.query(`DROP TABLE "users"`);
        });
    }
}
exports.initialize1685458723247 = initialize1685458723247;
