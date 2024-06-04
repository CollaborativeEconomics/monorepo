-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "storymedia" ADD CONSTRAINT "storymedia_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "stories"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
