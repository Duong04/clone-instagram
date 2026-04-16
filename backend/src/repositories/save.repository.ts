import { prisma } from '~/config/database'

class SaveRepository {
  async getSavedTargetIds(userId: string, targetIds: string[]): Promise<string[]> {
    const saves = await prisma.save.findMany({
      where: { user_id: userId, target_id: { in: targetIds } },
      select: { target_id: true }
    })
    return saves.map((s) => s.target_id)
  }
}
export default new SaveRepository()
