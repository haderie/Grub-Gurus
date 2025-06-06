import { ObjectId } from 'mongodb';
import { DatabaseQuestion, DatabaseTag, Question, Recipe, Tag } from '../types/types';
import QuestionModel from '../models/questions.model';
import TagModel from '../models/tags.model';

/**
 * Checks if given question contains any tags from the given list.
 *
 * @param {Question} q - The question to check
 * @param {string[]} taglist - The list of tags to check for
 *
 * @returns {boolean} - `true` if any tag is present in the question, `false` otherwise
 */
export const checkTagInQuestion = (q: Question, taglist: string[]): boolean => {
  for (const tagname of taglist) {
    for (const tag of q.tags) {
      if (tagname === tag.name) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Checks if given question contains any tags from the given list.
 *
 * @param {Recipe} q - The question to check
 * @param {string[]} taglist - The list of tags to check for
 *
 * @returns {boolean} - `true` if any tag is present in the question, `false` otherwise
 */
export const checkTagInRecipe = (q: Recipe, taglist: string[]): boolean => {
  for (const tagname of taglist) {
    for (const tag of q.tags) {
      if (tagname === tag.name) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Adds a tag to the database if it does not already exist.
 *
 * @param {Tag} tag - The tag to add
 *
 * @returns {Promise<Tag | null>} - The added or existing tag, or `null` if an error occurred
 */
export const addTag = async (tag: Tag): Promise<DatabaseTag | null> => {
  try {
    // Check if a tag with the given name already exists
    const existingTag: DatabaseTag | null = await TagModel.findOne({ name: tag.name });

    if (existingTag) {
      return existingTag;
    }

    // If the tag does not exist, create a new one
    const savedTag: DatabaseTag = await TagModel.create(tag);

    return savedTag;
  } catch (error) {
    return null;
  }
};

/**
 * Processes a list of tags by removing duplicates, checking for existing tags in the database,
 * and adding non-existing tags. Returns an array of the existing or newly added tags.
 * If an error occurs during the process, it is logged, and an empty array is returned.
 *
 * @param tags The array of Tag objects to be processed.
 *
 * @returns A Promise that resolves to an array of Tag objects.
 */
export const processTags = async (tags: Tag[]): Promise<DatabaseTag[]> => {
  try {
    // Extract unique tag names from the provided tags array using a Set to eliminate duplicates
    const uniqueTagNamesSet: Set<string> = new Set(tags.map(tag => tag.name));

    // Create an array of unique Tag objects by matching tag names
    const uniqueTags = [...uniqueTagNamesSet].map(
      name => tags.find(tag => tag.name === name)!, // The '!' ensures the Tag is found, assuming no undefined values
    );

    // Use Promise.all to asynchronously process each unique tag.
    const processedTags = await Promise.all(
      uniqueTags.map(async tag => {
        const dbTag = await addTag(tag);

        if (dbTag) {
          return dbTag; // If the tag does not exist, attempt to add it to the database
        }

        // Throwing an error if addTag fails
        throw new Error(`Error while adding tag: ${tag.name}`);
      }),
    );

    return processedTags;
  } catch (error) {
    return [];
  }
};

/**
 * Gets a map of tags and their corresponding question counts.
 *
 * @returns {Promise<Map<string, number> | null | { error: string }>} - A map of tags to their
 *          counts, `null` if there are no tags in the database, or the error message.
 */
export const getTagCountMap = async (): Promise<Map<string, number> | null | { error: string }> => {
  try {
    const tlist: DatabaseTag[] = await TagModel.find();

    const qlist: (Omit<DatabaseQuestion, 'tags'> & { tags: DatabaseTag[] })[] =
      await QuestionModel.find().populate<{
        tags: DatabaseTag[];
      }>({
        path: 'tags',
        model: TagModel,
      });

    if (!tlist || tlist.length === 0) {
      return null;
    }

    const tmap: Map<string, number> = new Map(tlist.map(t => [t.name, 0]));

    if (qlist != null && qlist !== undefined && qlist.length > 0) {
      qlist.forEach(q => {
        q.tags.forEach(t => {
          tmap.set(t.name, (tmap.get(t.name) || 0) + 1);
        });
      });
    }

    return tmap;
  } catch (error) {
    return { error: 'Error when constructing tag map' };
  }
};

/**
 * Processes an array of tag IDs to retrieve the corresponding tag objects.
 * This function takes an array of tag IDs, queries the database to find the tags with matching IDs,
 * and returns the found tags. If there is an error during the process, it logs the error and returns an empty array.
 *
 * @param tagIds An array of ObjectId values representing the tags to be retrieved.
 * @returns A promise that resolves to an array of Tag objects corresponding to the given tag IDs.
 */
export const processRecipeTags = async (tagIds: ObjectId[]): Promise<Tag[]> => {
  try {
    // Populate the tags by their ObjectId references
    const tags = await TagModel.find({ _id: { $in: tagIds } });

    return tags; // Return the found tags (which should be Tag objects)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error processing tags:', error);
    return [];
  }
};
